import { HttpException } from './http.exception';
import { HttpStatus } from './http-status.enum';

// import {HttpStatus} from './http-status.enum';

/**
 * 错误请求
 */
export class BadRequestException extends HttpException {
  constructor(message: string, res?: any) {
    super(message, HttpStatus.BAD_REQUEST, res);
    this.name = 'BadRequestException';
  }
}
