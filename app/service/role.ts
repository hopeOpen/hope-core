
import { Service } from 'egg';

export default class MenuService extends Service {


  /**
   * 获取用户菜单
   */
  public async getRoles(body: { pageNum: number, pageSize: number }) {
    const { ctx } = this;
    const { pageSize, pageNum } = body;
    return await ctx.model.Roles.findAll({
      attributes: ['id', 'roleName', 'menuConfig', 'description'],
      limit: pageSize,
      offset: (pageNum - 1) * pageSize
    });
  }

}