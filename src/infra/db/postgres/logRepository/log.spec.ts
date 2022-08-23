import Log from "../models";
import { LogMongoRepository } from "./log";

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};

describe("Log Postgres Repository", () => {
  test("Should create an error log on success", async () => {
    const sut = makeSut();
    await sut.logError("any_error");
    const count = await Log.findAll({
      include: {
        stack: "any_error",
      },
    });
    expect(count).toBeTruthy();
  });
});
