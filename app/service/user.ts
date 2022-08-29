import { Service } from 'egg';
import { LoginQuery, UserInfo, UpdateUserInfoType } from '../../interface/user';
import { ParamFormatErrorException } from '../exception/paramFormatError.exception'
import { BadRequestException } from '../exception/badRequest.exception';
import { SHA256 } from 'crypto-js';
import { HttpStatus } from '../exception/httpStatus.enum';
/**
 * User Service
 */
export default class UserService extends Service {
  /**
   * @param query
   */
  public async login(query: LoginQuery) {
    const { ctx } = this;
    const { name:username } = query;
    // 判断用户是否存在
    const user = await ctx.model.User.findOne({
      where: {
        name: username
      }
    })
    if(!user) {
      ctx.STATUS_CODE = HttpStatus.BAD_REQUEST;
      throw new BadRequestException("用户不存在");
    }
    const token = this.createdUserToken(query);
    console.log('token---...', token);
    if(token !== user.token) {
      ctx.STATUS_CODE = HttpStatus.BAD_REQUEST;
      throw new BadRequestException("密码错误");
    }
    return user;
  }

  /**
   * 添加用户
   * @param query
   */
  public async addUsers(body: UserInfo) {
    const { ctx } = this;
    // 密码生成md5 name+password+jwt.secret
    body.token = this.createdUserToken(body);
    body.roles = JSON.stringify(body.roles || []);
    return await ctx.model.User.create(body);
  }

  /**
   * 用户列表
   */
  public async Users(body) {
    const { ctx } = this;
    const { name = '', pageNum = 1, pageSize = 10 } = body;
    const condition = {
      attributes: [ 'id', 'name', 'email', 'roles' ],
      where: {
        // name等于什么条件
        // name,
      },
      // 第一页 从0开始
      offset: (pageNum - 1) * pageSize,
      // 每页显示多少条
      limit: +pageSize,
      // 表明返回的数据是json而不是model
      raw: true,
      // 以时间排序  倒序
      order: [[ 'updatedAt', 'DESC' ]],
    };
    if (name) {
      Object.assign(condition.where, {
        name: {
          // 模糊搜索
          $link: `%${name}%`,
        },
      });
    }
    const list = await ctx.model.User.findAndCountAll(condition);
    // 查找总数 模糊搜索
    list.rows.forEach(item => {
      item.roles = JSON.parse(item.roles);
    });
    return {
      list: list.rows,
      total: list.count,
      pageNum,
      pageSize,
    };
  }

  /**
   * 检验是否有重复的用户名
   * @return boolean true  没有重复 false 有重复
   */
  async checkName(body) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({
      where: {
        name: body.name,
      },
    });
    if(user && body.id !== user.id) {
      ctx.STATUS_CODE = HttpStatus.BAD_REQUEST;
      throw new ParamFormatErrorException("用户名已存在");
    }
  }

  /**
   * 用户详情
   */
  public async userInfo(id: number) {
    const { ctx } = this;
    if(!id) {
      ctx.STATUS_CODE = HttpStatus.BAD_REQUEST;
      throw new BadRequestException("id is required");
    }
    const user = await ctx.model.User.findOne({
      where: {
        id,
      },
      attributes: [ 'id', 'name', 'email', 'roles', 'desc' ],
    });
    if(!user) {
      ctx.STATUS_CODE = HttpStatus.BAD_REQUEST;
      throw new BadRequestException("用户不存在");
    }
    user.roles = JSON.parse(user.roles);
    return user;
  }

  /**
   * 更新用户信息
   */
  public async updateUser(body: UpdateUserInfoType) {
    const { ctx } = this;
    body.roles = JSON.stringify(body.roles || []);
    await ctx.model.User.update(body, {
      where: {
        id: body.id,
      },
    });
    return await ctx.model.User.findOne({
      where: {
        id: body.id,
      },
      attributes: [ 'id', 'name', 'email', 'roles', 'desc' ],
    });
  }

  /**
   * 删除用户
   */
  public async deleteUser(ids: number[] | string[]) {
    const { ctx } = this;
    await ctx.model.User.destroy({
      where: {
        id: ids,
      },
    });
  }

  /**
   * 生成token 用户名+密码
   * @param body 
   */
  createdUserToken(body: { name: string, password: string }) {
    const { name, password } = body;
    return SHA256(`${name}/${password}/${this.ctx.app.config.jwt.secret}`).toString();
  }

}
