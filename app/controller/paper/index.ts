import { Controller } from "egg";
import { BadRequestException } from "../../exception/badRequest.exception";
import { Post, Control } from "../../lib/requestMapping/decorator/httpMethod.decorator";
import { Body } from "../../lib/requestMapping/decorator/routerParams.decorator";
import { QuestionType, QuestionFilterType } from '../../../interface/question';

@Control('paper')
export default class PaperController extends Controller {
  /**
   * 添加题目
   */
  @Post("add-question")
  public async addQuestion(@Body() body: QuestionType) {
    const { ctx } = this;
    const { categoryId, topic, topicType, level, correctOption } = body;
    // 是否传入了题目
    if (!categoryId) {
      throw new BadRequestException('分类不能为空');
    }
    // 是否传入了题目类型
    if (!topicType && topicType !== 0) {
      throw new BadRequestException('题目类型不能为空');
    }
     // 是否传入了题目难度
    if (!level && level !== 0) {
      throw new BadRequestException('题目难度不能为空');
    }
    // 是否有正确答案
    if (!correctOption) {
      throw new BadRequestException('缺少正确答案');
    }
    // 分类是否存在
    await ctx.service.category.checkCategory(categoryId);
    // 判断题目是否有重合
    await ctx.service.paper.checkQuestion(topic);
    body.options = JSON.stringify(body.options);
    const result = await ctx.service.paper.addQuestion(body);
    result.options = JSON.parse(result.options);
    return result;
  }

  /**
   * 获取题目列表
   */
  @Post("question-list")
  public async getQuestionList(@Body() body: QuestionFilterType) {
    const { ctx } = this;
    const { categoryId } = body;
    // 分类是否存在
    await ctx.service.category.checkCategory(categoryId);
    return await ctx.service.paper.getQuestionList(body);
  }

  /**
   * 删除题目
   */
  @Post("delete-question")
  public async deleteQuestion(@Body() body: { ids: number[] }) {
    const { ctx } = this;
    const { ids } = body;
    if(!ids || !ids.length) {
      throw new BadRequestException('缺少题目id');
    }
    // 判断题目是否存在
    await ctx.service.paper.checkQuestionById(ids);
    return await ctx.service.paper.deleteQuestion(ids);
  }
}
