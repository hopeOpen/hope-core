import { Controller } from 'egg';
import{ Post, Control } from '../../lib/requestMapping/decorator/httpMethod.decorator';
import { verificationInfoFormat } from '../../utils/index';

@Control('user')
export default class UserController extends Controller {

  /**
   * 登陆
   */
  @Post('login')
  public async login() {
    const { ctx, app } = this;
    const { body } = ctx.request;
    const result = await ctx.service.user.login(body);
    const { token } = result;
    const jwtToken = ctx.app.jwt.sign(
      {
        name: body.name,
        token
      },
      app.config.jwt.secret,
      {
        // 时间根据自己定，具体可参考jsonwebtoken插件官方说明
        expiresIn: app.config.jwt.sign.expiresIn
      },
    );
    ctx.body = {
      token: jwtToken,
      message: '登录成功',
    };
  }

  @Post('logout')
  public logout() {
    
  }

  /**
   * 新增用户
   **/
  @Post('add-users')
  public async addUsers() {
    const { ctx } = this;
    const { body } = ctx.request;
    // 校验参数格式
    verificationInfoFormat(['name', 'email', 'password'],body);
    // 校验用户名是否重复
    await ctx.service.user.checkName(body);
    // TODO:校验邮箱是否重复

    const result = await ctx.service.user.addUsers(body);
    const { name, id, email, desc } = result;
    ctx.body = {
      name, id, email, desc
    };
  }

  /**
   * 用户列表
   **/
  @Post('list')
  public async users() {
    const { ctx } = this;
    const { body } = ctx.request;
    return await ctx.service.user.Users(body);
  }

  /**
   * 检验是否有重复的用户名
   */
  @Post('check-name')
  public async checkName() {
    const { ctx } = this;
    const { body } = ctx.request;
    await ctx.service.user.checkName(body);
    return '用户名可用';
  }

  /**
   * 用户详情
   */
  @Post('detail')
  public async userInfo() {
    const { ctx } = this;
    const { body } = ctx.request;
    return await ctx.service.user.userInfo(body.id);
  }

  /**
   * 更新用户信息
   */
  @Post('update')
  public async updateUser() {
    const { ctx } = this;
    const { body } = ctx.request;
    // 校验格式
    verificationInfoFormat(['name', 'email'],body);
    // 检验是否有重复的用户名
    await ctx.service.user.checkName(body);
    return await ctx.service.user.updateUser(body);
  }

  /**
   * 删除用户
   */
  @Post('delete')
  public async deleteUser() {
    const { ctx } = this;
    const { body } = ctx.request;
    await ctx.service.user.deleteUser(body.ids);
    return '删除成功'
  }
  


}


