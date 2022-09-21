import { Controller } from "egg";
import { Get, Control, Post } from "../../lib/requestMapping/decorator/httpMethod.decorator";
import { Body } from "../../lib/requestMapping/decorator/routerParams.decorator";
import { MenuConfigType } from '../../../interface/menu';
import { BadRequestException } from "../../exception/badRequest.exception";

@Control('menu')
export default class MenuController extends Controller {
  /**
   * 获取用户菜单 TODO: 未完成
   */
  @Get("permission")
  public async getMenus() {
    const { ctx } = this;
    return await ctx.service.menu.getMenus();
    // return [
    //   {
    //     name: "首页",
    //     sign: "manage.menu.index",
    //     url: "",
    //   },
    //   {
    //     name: "管理中心",
    //     sign: "manage.menu.management",
    //     url: "",
    //   },
    //   {
    //     name: "个人中心",
    //     parent: "manage.menu.management",
    //     sign: "manage.menu.personalCenter",
    //     url: "",
    //   },
    //   {
    //     name: "用户管理",
    //     parent: "manage.menu.management",
    //     sign: "manage.menu.userManagement",
    //     url: "",
    //   },
    //   {
    //     name: "角色管理",
    //     parent: "manage.menu.management",
    //     sign: "manage.menu.roleManagement",
    //     url: "",
    //   },
    //   {
    //     name: '学期准备',
    //     sign: 'manage.menu.paper',
    //     url: "",
    //   },
    //   {
    //     name: '试卷管理',
    //     parent: "manage.menu.paper",
    //     sign: 'manage.menu.testPaperManage',
    //     url: "",
    //   },
    //   {
    //     name: '题目管理',
    //     parent: "manage.menu.paper",
    //     sign: 'manage.menu.testQuestion',
    //     url: "",
    //   },
    //   {
    //     name: '题库管理',
    //     parent: "manage.menu.paper",
    //     sign: 'manage.menu.questionBank',
    //     url: "",
    //   }
    // ];
  }

  /**
   * 获取页面集合
   */
  @Post("config")
  public async getMenuConfig() {
    const { ctx } = this;
    const result = await ctx.service.menu.getMenuConfig();
    return result;
  }

  /**
   * 新增页面
   */
  @Post("add")
  public async addMenu(@Body() body: MenuConfigType) {
    const { ctx } = this;
    const { index } = body;
    if (!index && index !== 0) {
      throw new BadRequestException("index is required");
    }
    // 校验是否名称重复
    await ctx.service.menu.checkMenuNameExist(body.name);
    // 校验sign是否重复
    await ctx.service.menu.checkMenuSignExist(body.sign);
    return await ctx.service.menu.addMenu(body);
  }

  /**
   * 更新页面
   */
  @Post("update")
  public async updateMenu(@Body() body: MenuConfigType) {
    const { ctx } = this;
    const { id, index } = body;
    if (!id) {
      throw new BadRequestException("id is required");
    }
    if (!index && index !== 0) {
      throw new BadRequestException("index is required");
    }
    // 校验是否名称重复
    await ctx.service.menu.checkMenuNameExist(body.name, id);
    // 校验sign是否重复
    await ctx.service.menu.checkMenuSignExist(body.sign, id);
    return await ctx.service.menu.updateMenu(body);
  }

  /**
   * 批量修改页面index
   */
  @Post('updateIndex')
  public async updateMenuIndex(@Body() body: { id: number, index: number, parentId: number }[]) {
    const { ctx } = this;
    return await ctx.service.menu.updateMenuIndex(body);
  }

  /**
   * 删除页面配置
   */
  @Post('delete')
  public async deleteMenu(@Body() body: { id: number, index: number, parentId: number }) {
    const { ctx } = this;
    const { id, index, parentId } = body;
    if(!id) {
      throw new BadRequestException("id is required");
    }
    return await ctx.service.menu.deleteMenu({ id, index, parentId });
  }
}
