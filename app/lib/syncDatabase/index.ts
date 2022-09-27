/**
 * 同步数据库
 * 数据库中没有用户信息 角色等信息的情况下
 */

import { Application } from "egg";
import { createdUserToken } from "../../utils";

export class SyncDatabase {
  app: Application;
  secret: string;

  constructor(app: Application) {
    this.app = app;
    this.secret = app.config.jwt.secret;
  }

  /**
   * 同步菜单、角色、用户
   */
  async sync() {
    this.app.logger.info("init sync ---> start");
    // 1
    await this.createMenus();
    this.app.logger.info("init sync ---> end");
  }

  /**
   * 创建admin用户
   */
  async createDefaultUser() {
    // 获取所有角色
    const result = await this.app.model.User.findAll();
    if (!result || !result.length) {
      this.app.logger.info("init user ---> start");
      const rolesData = await this.app.model.Roles.findAll();
      const defaultUserInfo = {
        token: createdUserToken(
          { name: "admin", password: "abcd1234" },
          this.secret
        ),
        name: "admin",
        password: "abcd1234",
        email: "835@qq.com",
        roles: JSON.stringify(rolesData.map((item) => item.id)),
      };
      this.app.model.User.create(defaultUserInfo);

      this.app.logger.info("init user ---> end");
    }
  }

  /**
   * 创建角色
   */
  async createRoles() {
    const rolesData = await this.app.model.Roles.findAll();

    if (!rolesData || !rolesData.length) {
      this.app.logger.info("init roles ---> start");
      const result = await this.app.model.Menu.findAll();
      const ids = result.map((item) => item.id);
      const defaultRoles = [
        {
          roleName: "admin",
          menuConfig: JSON.stringify(ids),
          description: "超级管理员",
        },
      ];
      defaultRoles.forEach(async (role, index) => {
        await this.app.model.Roles.create(role);
        if(index === defaultRoles.length - 1) {
          // 3
          await this.createDefaultUser();
        }
      });
      this.app.logger.info("init roles ---> end");
    } else {
      this.createDefaultUser();
    }
  }

  /**
   * 创建页面权限集合
   */
  async createMenus() {
    const defaultMenus = [
      {
        name: "个人概括",
        sign: "manage.menu.index",
        index: 0,
        parentId: null,
      },
      {
        name: "管理中心",
        sign: "manage.menu.management",
        index: 2,
        parentId: null,
        children: [
          {
            name: "个人中心",
            sign: "manage.menu.personalCenter",
            index: 0,
            parentId: "",
          },
          {
            name: "用户管理",
            sign: "manage.menu.userManagement",
            index: 1,
            parentId: "",
          },
          {
            name: "角色管理",
            sign: "manage.menu.roleManagement",
            index: 2,
            parentId: "",
          },
        ],
      },
      {
        name: "学前准备",
        sign: "manage.menu.paper",
        index: 1,
        parentId: null,
        children: [
          {
            name: "试卷管理",
            sign: "manage.menu.testPaperManage",
            index: 0,
            parentId: "",
          },
          {
            name: "题目管理",
            sign: "manage.menu.testQuestion",
            index: 1,
            parentId: "",
          },
          {
            name: "题库管理",
            sign: "manage.menu.questionBank",
            index: 2,
            parentId: "",
          },
        ],
      },
      {
        name: "设置",
        sign: "manage.menu.setting",
        index: 3,
        parentId: null,
      },
    ];
    const result = await this.app.model.Menu.findAll();
    // 判断数据库中具有默认数据
    if (!result || !result.length) {
      this.app.logger.info("init menus ---> start");
      defaultMenus.forEach(async (menu, index) => {
        const data = await this.app.model.Menu.create(menu);
        if (menu.children) {
          menu.children.forEach(async (child) => {
            child.parentId = data.id;
            await this.app.model.Menu.create(child);
          });
        }
        
        if(index === defaultMenus.length - 1) {
          // 2
          await this.createRoles();
        }
      });
      this.app.logger.info("init menus ---> end");
    } else {
      this.createRoles();
    }
  }
}
