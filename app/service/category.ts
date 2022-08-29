import { Service } from 'egg';
import { BadRequestException } from '../exception/badRequest.exception';

export default class CategoryService extends Service {

  /**
   * 分类列表
   * @returns 
   */
  async getCategoryList() {
    const result = await this.ctx.model.Category.findAll({
      attributes: ['id', 'categoryName', 'categoryLevel', 'parentId']
    });
    if (!result) throw new BadRequestException('获取分类失败');
    // 扁平数据转换树状结构
    const data = this.ctx.helper.flatToTree(result);
    return data;
  }

  /**
   * 新增分类
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
  async checkCategory(params: number | string, id?: number): Promise<void> {
    if (typeof params === 'string') {
      const result = await this.ctx.model.Category.findOne({
        where: {
          categoryName: params,
        },
      });
      if (result && result.id !== id) {
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
        throw new BadRequestException('分类不存在');
      } 
    }
  }

  /**
   * 更新分类
   */
  async updateCategory(query) {
    const { id, categoryName } = query;
    const result = await this.ctx.model.Category.update(query, {
      where: {
        id
      }
    });
    if (!result) throw new BadRequestException('更新分类失败');
    return {id, categoryName}
  }

  /**
   * 删除分类
   */
  async deleteCategory(id) {
    const result = await this.ctx.model.Category.destroy({
      where: {
        id
      }
    });
    if (!result) throw new BadRequestException('删除分类失败');
    return '删除失败'
  }

  /**
   * 模糊搜索分类
   */
  async searchCategory(keyword) {
    const result = await this.ctx.model.Category.findAll({
      where: {
        categoryName: {
          $link: `%${keyword}%`
        }
      }
    });
    if (!result) throw new BadRequestException('搜索分类失败');
    return result;
  }
}