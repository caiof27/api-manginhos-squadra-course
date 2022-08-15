export class ServerError extends Error {
    constructor() {
      super(`Interval Server Error`);
      this.name = "MissingParamError";
    }
  }
  