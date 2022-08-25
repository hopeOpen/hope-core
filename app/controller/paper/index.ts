import { Controller } from "egg";
import { Post, Control } from "../../lib/requestMapping/decorator/httpMethod.decorator";

@Control('paper')
export default class PaperController extends Controller {
  /**
   * 添加题目
   */
  @Post("add-question")
  public async addQuestion() {
    const { ctx } = this;
    const { body } = ctx.request;
    body.options = JSON.stringify(body.options);
    const result = await ctx.service.paper.addQuestion(body);
    result.options = JSON.parse(result.options);
    return result;
  }
}
