import { Service } from 'egg';
import { MenuConfigType } from '../../interface/menu';
import { BadRequestException } from '../exception/badRequest.exception';

export default class MenuService extends Service {
  /**
   * 获取用户菜单
   */
  public async getMenus() {
  
  }

  /**
   * 获取所有页面配置
   */
  public getMenuConfig() {
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
        subMenus: [
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
          }
        ]
      },
      {
        name: '学期准备',
        sign: 'manage.menu.paper',
        url: "",
        subMenus: [
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
        ]
      }
    ]
  }

  /**
   * 新增页面
   */
  public async addMenu(body: MenuConfigType) {
    const { ctx }  = this;
    const result = await ctx.model.Menu.create(body);
    if (!result) {
      throw new BadRequestException('新增页面失败');
    }
    return result;
  }

  /**
   * 校验页面名称是否存在
   */
  public async checkMenuNameExist(name: string) {
    const { ctx }  = this; 
    const result = await ctx.model.Menu.findOne({
      while: {
        name
      }
    });
    if (result) {
      throw new BadRequestException('页面名称已存在');
    }
  }

  /**
   * 校验页面标识是否存在
   */
  public async checkMenuSignExist(sign: string) {
    const { ctx }  = this; 
    const result = await ctx.model.Menu.findOne({
      while: {
        sign
      }
    });
    if (result) {
      throw new BadRequestException('页面标识已存在');
    }
  }
}