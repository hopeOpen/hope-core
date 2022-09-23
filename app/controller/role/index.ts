import { Controller } from "egg";
import { BadRequestException } from "../../exception/badRequest.exception";
import { Control, Post } from "../../lib/requestMapping/decorator/httpMethod.decorator";
import { Body } from "../../lib/requestMapping/decorator/routerParams.decorator";

@Control('roles')
export default class RoleController extends Controller {

  /**
   * 获取角色列表
   */
  @Post()
  public async getRoles(@Body() body: { pageNum: number, pageSize: number }) {
    const { ctx } = this;
    return await ctx.service.role.getRoles(body);
  }

  /**
   * 新增角色
   */
  @Post('add')
  public async addRole(@Body() body: { roleName: string, menuConfig: number[], description: string }) {
    const { ctx } = this;
    const { roleName, menuConfig, description } = body;
    if (!roleName.trim()) {
      throw new BadRequestException('角色名称不能为空');
    }
    if (!menuConfig.length) {
      throw new BadRequestException('角色权限至少有一项');
    }
    // 校验角色名称是否存在
    const result = await ctx.service.role.checkRoleName(roleName);
    if (result && result.length) {
      throw new BadRequestException('角色名称已存在');
    }
    return await ctx.service.role.addRole({ roleName, menuConfig: JSON.stringify(menuConfig), description });
  }

  /**
   * 删除角色
   */
  @Post('delete')
  public async deleteRole(@Body() body: { ids: number[] }) {
    const { ctx } = this;
    const { ids } = body;
    if(!ids || !ids.length) {
      throw new BadRequestException('id is required');
    }
    // 判断角色是否存在
    await ctx.service.role.checkRole(ids)
    return await ctx.service.role.deleteRole(ids);
  }


}