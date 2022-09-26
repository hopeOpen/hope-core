import { Service } from 'egg';
import { MenuConfigType } from '../../interface/menu';
import { BadRequestException } from '../exception/badRequest.exception';

export default class MenuService extends Service {
  /**
   * 获取用户菜单
   * @param roles 角色id集合
   */
  public async getMenus(roles: number[]) {
    if (!roles || !roles.length) {
      return [];
    }
    const { ctx } = this;
    const rolesData = await ctx.model.Roles.findAll({
      where: {
        id: roles
      }
    });
    if (!rolesData || !rolesData.length) {
      throw new BadRequestException('无角色权限');
    }
    // 查询长度不一致 需更新用户角色权限长度例如 删除了角色，用户还有该角色
    if (roles.length !== rolesData.length) {
      this.updateUserRoles(rolesData);
    }
    // 获取菜单id集合
    const menuConfig = rolesData.reduce((arr, item) => {
      const menuIds = JSON.parse(item.dataValues.menuConfig);
      menuIds.forEach((id: number) => {
        if (arr.includes(id)) return;
        arr.push(id)
      })
      return arr;
    }, []);

    return await ctx.model.Menu.findAll({
      where: {
        id: menuConfig
      },
      attributes: ['id', 'name', 'sign', 'index', 'parentId']
    });
  }

  /**
   * 获取所有页面配置
   */
  public async getMenuConfig() {
    const { ctx }  = this;
    const result = await ctx.model.Menu.findAll({
      attributes: ['id', 'name', 'sign', 'index', 'parentId']
    });
    if (!result) {
      throw new BadRequestException('获取页面配置失败');
    }
    // 处理分级
    const data = JSON.parse(JSON.stringify(result));
    const obj: any = {};
    const itemMap = new Map(data.map(node => [node.id, node]));
    data.forEach((item) => {
      const parent: any = itemMap.get(Number(item.parentId)) || obj;
      !parent.subMenus && (parent['subMenus'] = []);
      parent.subMenus.push(item)
    });
    const menus = obj.subMenus?.filter((item) => !item.parentId) || [];

    // 排序
    menus.sort((a, b) => {
      // 二级菜单也需要排序
      if(a.subMenus) {
        a.subMenus.sort((childA, childB) => childA.index - childB.index);
      }
      if(b.subMenus) {
        b.subMenus.sort((childA, childB) => childA.index - childB.index);
      }
      return a.index - b.index;
    });

    return menus;
  }

  /**
   * 校验页面名称是否存在
   */
  public async checkMenuNameExist(name: string, id?: number) {
    const { ctx }  = this; 
    const result = await ctx.model.Menu.findOne({
      where: {
        name
      }
    });
    if (result && result.id !== id) {
      throw new BadRequestException('页面名称已存在');
    }
  }

  /**
   * 校验页面标识是否存在
   */
  public async checkMenuSignExist(sign: string, id?: number) {
    const { ctx }  = this; 
    const result = await ctx.model.Menu.findOne({
      where: {
        sign
      }
    });
    if (result && result.id !== id) {
      throw new BadRequestException('页面标识已存在');
    }
  }


  /**
   * 新增页面
   */
  public async addMenu(body: MenuConfigType) {
    const { ctx }  = this;
    const { parentId = '', index } = body;
    // 检查是否存在相同index 有的话需更新其他index
    const oldPageData = await this.findIndexPage(parentId, index);
    if(oldPageData) {
      await this.handleOtherPageIndex(index, parentId, 'add');
    }
    const result = await ctx.model.Menu.create(body);
    if (!result) {
      throw new BadRequestException('新增页面失败');
    }
    return result;
  }


  /**
   * 更新页面配置
   */
  public async updateMenu(body: MenuConfigType) {
    const { ctx }  = this;
    const result = await ctx.model.Menu.update(body, {
      where: {
        id: body.id
      }
    });
    if (!result) {
      throw new BadRequestException('更新页面配置失败');
    }
    return await ctx.model.Menu.findOne({
      where: {
        id: body.id
      },
      attributes: ['id', 'name', 'sign', 'index', 'parentId']
    });
  }

  /**
   * 批量修改页面index 
   */
  public async updateMenuIndex(body: {id: number, index: number, parentId: number}[]) {
    console.log('body', body);
  }

  /**
   * @param data 当前页面数据
   * @param.id 当前页面id
   * @param.index 当前页面index
   * @param.parentId 当前页面父级id
   * 删除页面配置
   */
  public async deleteMenu(data: {id: number, index: number, parentId: number}) {
    const { id, index, parentId } = data;
    const { ctx } = this;
    const result  = await ctx.model.Menu.destroy({
      where: {
        id
      }
    })
    if(!result) {
      throw new BadRequestException('删除失败');
    }
    // 如果有子页面 则同时删除子页面
    if (!parentId) {
      const childPageData = await ctx.model.Menu.findAll({
        where: {
          parentId: id
        }
      });
      await ctx.model.Menu.destroy({
        where: {
          id: childPageData.map(item => {
            return item.dataValues.id;
          })
        }
      })
    }
    await this.handleOtherPageIndex(index, parentId, 'delete');
    return result;
  }

  /**
   * @param parentId 父级id
   * @param index 当前页面index
   * 根据index找page
   */
  public async findIndexPage(parentId: number | string, index: number) {
    const { ctx } = this;
    const result = await ctx.model.Menu.findOne({
      where: {
        parentId,
        index
      }
    });
    return result;
  }

  /**
   * 同一父级下其他的页面
   * @param index 
   * @param parentId 
   * @returns 
   */
  public async handleOtherPageIndex(index: number, parentId: number | string, type: string) {
    const { ctx } = this;
    // 查找其余页面进行处理
    const otherPageData = await ctx.model.Menu.findAndCountAll({
      where: {
        parentId,
        index: {
          $gte: index
        }
      }
    });
    // 更新其余页面index
    if(otherPageData.count) {
      this.updatePageIndex(otherPageData.rows, index, type);
    }
  }

  /**
   * 更新菜单顺序
   * @param otherData 其余页面数据
   * @param index 当前页面index
   * @param type 操作类型
   */
  async updatePageIndex(otherData: any, currentIndex: number, type: string) {
    try {
      // 过滤只需要id index
      otherData = otherData.map((item) => {
        const { id, index } = item.dataValues;
        return { id, index };
      });
      // 从小到大排序
      otherData.sort((a, b) => a.index - b.index);
      // add时需要额外+1
      const extraValue = type === 'add' ? 1 : 0;
      otherData.forEach((item, index) => {
        item.index = index + currentIndex + extraValue;
      });

      const { ctx } = this;
      // 批量更新
      ctx.model.Menu.bulkCreate(otherData, { updateOnDuplicate: [ 'id', 'index' ] })
    } catch (error) {
      throw new BadRequestException('删除成功，但更新顺序失败');
    }
  }

  // 查询长度不一致 需更新用户角色权限长度例如 删除了角色，用户还有该角色
  async updateUserRoles(rolesData: any) {
    const ids = rolesData.map((item: any) => {
      return item.dataValues.id;
    });
    const { ctx } = this;
    const { name, token } = ctx.userInfo;
    await ctx.model.User.update({roles: JSON.stringify(ids)}, {
      where: {
        name,
        token
      }
    })
  }
}