import { Controller } from "egg";
import { Get, Control, Post } from "../../lib/requestMapping/decorator/httpMethod.decorator";

@Control('menu')
export default class MenuController extends Controller {
  /**
   * 获取用户菜单 TODO: 未完成
   */
  @Get("permission")
  public async getMenus() {
    return [
      {
        name: "首页",
        sign: "manage.menu.index",
        url: "",
      },
      {
        name: "管理中心",
        sign: "manage.menu.management",
        url: "",
      },
      {
        name: "个人中心",
        parent: "manage.menu.management",
        sign: "manage.menu.personalCenter",
        url: "",
      },
      {
        name: "用户管理",
        parent: "manage.menu.management",
        sign: "manage.menu.userManagement",
        url: "",
      },
      {
        name: "角色管理",
        parent: "manage.menu.management",
        sign: "manage.menu.roleManagement",
        url: "",
      },
      {
        name: '学期准备',
        sign: 'manage.menu.paper',
        url: "",
      },
      {
        name: '试卷管理',
        parent: "manage.menu.paper",
        sign: 'manage.menu.testPaperManage',
        url: "",
      },
      {
        name: '题目管理',
        parent: "manage.menu.paper",
        sign: 'manage.menu.testQuestion',
        url: "",
      },
      {
        name: '题库管理',
        parent: "manage.menu.paper",
        sign: 'manage.menu.questionBank',
        url: "",
      }
    ];
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
}
