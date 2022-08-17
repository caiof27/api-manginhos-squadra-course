export class ServerError extends Error {
    constructor(stack: string) {
      super(`Interval Server Error`);
      this.name = "ServerError";
      this.stack = stack;
    }
  }
  