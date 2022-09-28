import { Controller } from 'egg';
import{ Post, Control } from '../../lib/requestMapping/decorator/httpMethod.decorator';
import { verificationInfoFormat } from '../../utils/index';
import { BadRequestException } from '../../exception/badRequest.exception';
import { HttpStatus } from '../../exception/httpStatus.enum';
import { Body } from '../../lib/requestMapping/decorator/routerParams.decorator';

@Control('user')
export default class UserController extends Controller {

  /**
   * 登陆
   */
  @Post('login')
  public async login() {
    const { ctx, app } = this;
    const { body } = ctx.request;
    if(!body.name || !body.password) {
      ctx.STATUS_CODE = HttpStatus.BAD_REQUEST;
      throw new BadRequestException("用户名或密码不能为空");
    }
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
        expiresIn: '1d'
      },
    );
    ctx.cookies.set(app.config.tokenField, jwtToken, {
      // 设置cookie的有效期 毫秒
      maxAge: 60 * 60 * 1000, 
      // 只允许服务端访问cookie    
      httpOnly: false,
      // 对cookie进行签名，防止用户修改cookie
      signed: true,  
      // 是否对cookie进行加密
      // cookie加密后获取的时候要对cookie进行解密  
      // cookie加密后就可以设置中文cookie 
      encrypt: true
    })
    ctx.body = {
      code: 200,
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
  public async addUsers(@Body() body) {
    const { ctx } = this;
    // 校验参数格式
    verificationInfoFormat(['name', 'email', 'password'],body, ctx);
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
    verificationInfoFormat(['name', 'email'],body, ctx);
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

  /**
   * 用户信息
   */
  @Post('info')
  public async info() {
    const { ctx } = this;
    return ctx.userInfo;
  }
  
}


