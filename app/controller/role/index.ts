import { Controller } from "egg";
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

}