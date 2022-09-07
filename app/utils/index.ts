import { Context } from "egg";
import { OperationNotAllowedException } from "../exception/operateNotAllowed.exception";
import { HttpStatus } from '../exception/httpStatus.enum';

// 是否为空对象
export const isEmptyObject = (val: object) => {
  for (const key in val) {
    if (val.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

/**
 * 检验问题信息格式
 * @param needs keys 需要验证的key
 * @param body 请求参数
 * @returns
 */
export const verificationInfoFormat = (needs: string[], body: any, ctx:Context) => {
  const defaultRule = {
    name: {
      reg: /^[a-zA-Z0-9_]{3,18}$/,
      message: "用户名只支持英文、数字、下划线，长度3-18位",
    },
    email: {
      reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: "邮箱格式不正确",
    },
    password: {
      reg: /^[a-zA-Z]\w{5,17}$/,
      message: "密码只支持英文、数字、下划线，长度6-18位",
    },
  };

  needs.forEach((key) => {
    if (!defaultRule[key].reg.test(body[key])) {
      ctx.STATUS_CODE = HttpStatus.FORBIDDEN;
      throw new OperationNotAllowedException(defaultRule[key].message);
    }
  });
};

export const getDataType = (obj:any) => {
  let type  = typeof obj;
  if (type !== "object") {    // 先进行typeof判断，如果是基础数据类型，直接返回
    return type;
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  // return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1'); 
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

