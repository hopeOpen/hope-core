export class HttpException extends Error {
  private readonly status;
  private readonly response;

  constructor(message: string, status: number, response?: string | object) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'HttpException';
    this.response = response;
    this.status = status;
    this.message = message;
  }

  getResponse() {
    return this.response;
  }

  getStatus() {
    return this.status;
  }

  getMessage() {
    return this.message;
  }
}
