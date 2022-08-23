import { Service } from 'egg';
import { BadRequestException } from '../exception/badRequest.exception';

export default class CategoryService extends Service {
  /**
   * @param query
   */
  async addCategory (query) {
    const result = await this.ctx.model.Category.create(query);
    if (!result) throw new BadRequestException('新增分类失败');
    const { id, categoryName, categoryLevel, parentId } = result;
    return {id, categoryName, categoryLevel, parentId}
  }

  /**
   * 校验分类是否存在
   * @param params {number | string} 分类id | 分类名称
   */
  async checkCategory(params: number | string): Promise<void> {
    if (typeof params === 'string') {
      const result = await this.ctx.model.Category.findOne({
        where: {
          categoryName: params,
        },
      });
      if (result) {
        throw new BadRequestException('分类已存在');
      }
    }
    if (typeof params === 'number') { 
      const result = await this.ctx.model.Category.findOne({
        where: {
          id: params
        }
      })
      if(!result) {
        throw new BadRequestException('一级分类不存在');
      } 
    }
  }
}