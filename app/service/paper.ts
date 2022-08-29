import { Service } from 'egg';
import { BadRequestException } from '../exception/badRequest.exception';
import { QuestionType } from '../../interface/question';

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
}