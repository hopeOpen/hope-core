import { Controller } from "egg";
import { Post, Control } from "../../lib/requestMapping/decorator/httpMethod.decorator";
import { Body } from '../../lib/requestMapping/decorator/routerParams.decorator';
import { BadRequestException } from "../../exception/badRequest.exception";

@Control('paper')
export default class CategoryController extends Controller {

  @Post('category-list')
  public async getCategoryList() {
    const { ctx } = this;
    return ctx.service.category.getCategoryList();
  }

  /**
   * 添加分类
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

  /**
   * 更新分类
   */
  @Post("update-category")
  public async updateCategory(@Body() body: any) {
    const { ctx } = this;
    const { id, categoryName } = body;
    if(!id) {
      throw new BadRequestException('分类id不能为空');
    }
    if(!categoryName) {
      throw new BadRequestException('分类名称不能为空');
    }
    // 校验一级分类是否存在
    await ctx.service.category.checkCategory(categoryName, id);
    return ctx.service.category.updateCategory(body);
  }

  /**
   * 删除分类
   */
  @Post("delete-category")
  public async deleteCategory(@Body() body: any) {
    const { ctx } = this;
    const { id } = body;
    if(!id) {
      throw new BadRequestException('分类id不能为空');
    }
    return ctx.service.category.deleteCategory(id);
  }

  /**
   * 模糊搜索分类
   */
  @Post("search-category")
  public async searchCategory(@Body() body: any) {
    const { ctx } = this;
    const { categoryName } = body;
    if(!categoryName) {
      throw new BadRequestException('分类名称不能为空');
    }
    return ctx.service.category.searchCategory(categoryName);
  }
}
