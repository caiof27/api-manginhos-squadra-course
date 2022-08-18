import { LogErrorRepository } from "../../data/protocols/logErrorRepository";
import { AccountModel } from "../../domain/models/account";
import { serverError, ok } from "../../presentation/helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { logControllerDecorator } from "./log";

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve(null));
    }
  }
  return new LogErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())));
    }
  }
  return new ControllerStub();
};

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_ID",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    name: "any_name",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

interface sutTypes {
  sut: logControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): sutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new logControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });
  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
  test("Should call LogErrorRepository with correct error if controller a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError()))
      );
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
