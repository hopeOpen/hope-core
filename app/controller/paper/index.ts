import { Controller } from "egg";
import { BadRequestException } from "../../exception/badRequest.exception";
import { Post, Control } from "../../lib/requestMapping/decorator/httpMethod.decorator";
import { Body } from "../../lib/requestMapping/decorator/routerParams.decorator";
import { QuestionType } from '../../../interface/question';

@Control('paper')
export default class PaperController extends Controller {
  /**
   * 添加题目
   */
  @Post("add-question")
  public async addQuestion(@Body() body: QuestionType) {
    const { ctx } = this;
    const { categoryType, topic, correctOption } = body;
    // 分类是否存在
    await ctx.service.category.checkCategory(categoryType);
    // 判断题目是否有重合
    await ctx.service.paper.checkQuestion(topic);
    // 是否有正确答案
    if (!correctOption) {
      throw new BadRequestException('缺少正确答案');
    }
    body.options = JSON.stringify(body.options);
    const result = await ctx.service.paper.addQuestion(body);
    result.options = JSON.parse(result.options);
    return result;
  }
}
