import { Service } from 'egg';
import { BadRequestException } from '../exception/badRequest.exception';
import { QuestionType, QuestionFilterType } from '../../interface/question';

export default class PaperService extends Service {
  /**
   * 新增题目
   * @param query
   */
  public async addQuestion(query: QuestionType) {
    const { ctx } = this;
    const result = await ctx.model.Question.create(query);
    if(!result) {
      throw new BadRequestException('新增题目失败');
    }
    return result;
  }

  /**
   * 判断是否有题目一样
   */
  public async checkQuestion(topic: string) {
    const { ctx } = this;
    const result = await ctx.model.Question.findOne({
      where: {
        topic,
      },
    });
    if (result && result.topic === topic) {
      throw new BadRequestException('题目已存在');
    }
  }

  /**
   * 获取题目列表
   */
  public async getQuestionList(query: QuestionFilterType) {
    const { ctx } = this;
    const { pageSize, pageNum } = query;
    const condition = {
    }
    const keys = ['categoryId', 'level', 'topicType', 'topic']
    keys.forEach(key => {
      if (query[key]) {
        condition[key] = query[key];
      }
    })
    const result = await ctx.model.Question.findAndCountAll({
      attributes: [ 'id', 'categoryId', 'correctOption', 'level',
        'options', 'parsing', 'topic', 'topicType' ],
      where: condition,
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    });
    return {
      list: result.rows,
      total: result.count,
      pageNum,
      pageSize
    };
  }

  /**
   * 校验题目是否存在
   */
  public async checkQuestionById(id: number[]) {
    const { ctx } = this;
    const result = await ctx.model.Question.findAll({
      where: {
        id,
      },
    });
    if (!result) {
      throw new BadRequestException('题目不存在');
    }
    // 比较id长度是否一致
    if(result.length !== id.length) {
      throw new BadRequestException('包含不存在的题目');
    }
  }

  /**
   * 删除题目
   */
  public async deleteQuestion(id: number[]) {
    const { ctx } = this;
    const result = await ctx.model.Question.destroy({
      where: {
        id,
      },
    });
    if (!result) {
      throw new BadRequestException('删除题目失败');
    }
    return result;
  }
}