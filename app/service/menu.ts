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
    const menus = obj.subMenus.filter((item) => !item.parentId);

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
    // TODO: index 同步修改
    return await ctx.model.Menu.findOne({
      where: {
        id: body.id
      },
      attributes: ['id', 'name', 'sign', 'index', 'parentId']
    });
  }
}