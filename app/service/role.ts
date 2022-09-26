
import { Service } from 'egg';
import { BadRequestException } from '../exception/badRequest.exception';

export default class MenuService extends Service {


  /**
   * 获取用户菜单
   */
  public async getRoles(body: { pageNum?: number, pageSize?: number }) {
    const { ctx } = this;
    const { pageSize, pageNum } = body;
    const where = {};
    pageSize ? where['limit'] = pageSize : '';
    pageNum ? where['offset'] = (pageNum - 1) * pageSize : '';
    const result =  await ctx.model.Roles.findAndCountAll({
      attributes: ['id', 'roleName', 'menuConfig', 'description'],
      ...where
    });
    return {
      list: result.rows,
      total: result.count,
      pageNum,
      pageSize
    }
  }

  /**
   * 新增角色
   */
  public async addRole(body: { roleName: string, menuConfig: string, description: string }) {
    const { ctx } = this;
    const result = await ctx.model.Roles.create(body);
    if (!result) {
      throw new Error('新增角色失败');
    }
    return result;
  }
  
  /**
   * 校验角色名称是否存在
   */
  public async checkRoleName(roleName: string) {
    return await this.ctx.model.Roles.findAll({
      where: {
        roleName
      }
    });
  }

  /**
   * 校验角色是否存在
   */
  public async checkRole(id: number[]) {
    const { ctx } = this;
    const result = await ctx.model.Roles.findAll({
      where: {
        id,
      },
    });
    if (!result) {
      throw new BadRequestException('角色不存在');
    }
    // 比较id长度是否一致
    if(result.length !== id.length) {
      throw new BadRequestException('包含不存在的角色');
    }
  }

  /**
   * 删除角色
   * TODO：删除角色时，需要判断角色是否被使用
   */
  public async deleteRole(id: number[]) {
    const { ctx } = this;
    const result = await ctx.model.Roles.destroy({
      where: {
        id,
      },
    });
    if (!result) {
      throw new BadRequestException('删除角色失败');
    }
    return result;
  }

  /**
   * 更新角色
   */
  public async updateRole(body: { id: number, roleName: string, menuConfig: string, description: string }) {
    const { ctx } = this;
    const result = await ctx.model.Roles.update(body, {
      where: {
        id: body.id
      }
    });
    if (!result) {
      throw new BadRequestException('更新角色失败');
    }
    return result;
  }
}