import { Controller } from "egg";
import { Post, Control } from "../../lib/requestMapping/decorator/httpMethod.decorator";
import { Body } from '../../lib/requestMapping/decorator/routerParams.decorator';
import { BadRequestException } from "../../exception/badRequest.exception";

@Control('paper')
export default class CategoryController extends Controller {
  /**
   * 添加题目
   */
  @Post("add-category")
  public async addCategory(@Body() body: any) {
    const { ctx } = this;
    const { categoryLevel, parentId, categoryName } = body;
    if(!categoryName) {
      throw new BadRequestException('分类名称不能为空');
    } else {
      if(categoryName.length > 20) {
        throw new BadRequestException('分类名称不能超过20个字符');
      }
      await ctx.service.category.checkCategory(categoryName);
    }
    if(categoryLevel === 2 && !parentId) {
      throw new BadRequestException('一级分类的父级分类不能为空');
    }
    // 校验一级分类是否存在
    if(parentId) {
      await ctx.service.category.checkCategory(parentId);
    }
    
    return ctx.service.category.addCategory(body);
  }
}
