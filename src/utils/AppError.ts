class AppError extends Error {
  public isOperational = true;
  public status: string;

  constructor(_message: string, public statusCode: number) {
    super(_message);

    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
