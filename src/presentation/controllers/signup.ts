import { httpRequest, httpResponse } from "../protocols/http";

import { badRequest, serverError } from "../helpers/http-helper";
import { Controller, EmailValidator } from "../protocols/index";
import { MissingParamError, InvalidParamError } from "../errors/index";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: httpRequest): httpResponse {
    try {
      const requireFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return serverError();
    }
  }
}
