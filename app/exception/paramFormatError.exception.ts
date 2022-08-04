import {HttpException} from './http.exception';
import {HttpStatus} from './http-status.enum';

/**
 * 参数格式错误异常
 */
export class ParamFormatErrorException extends HttpException {
  constructor(message?: string, res?: any, status?: number) {
    super(message || 'Param format error', status || HttpStatus.BAD_REQUEST, res);
    this.name = 'ParamFormatErrorException';
  }
}
