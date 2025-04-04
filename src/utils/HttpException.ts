export class HttpException extends Error {
    status: number
    errors?: any
  
    constructor(status: number, message: string, errors?: any) {
      super(message)
      this.status = status
      this.errors = errors
      Object.setPrototypeOf(this, HttpException.prototype)
    }
  }