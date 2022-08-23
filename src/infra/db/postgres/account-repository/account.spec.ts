
import { AccountPostgresRepository } from "./account";
describe("Account Postgres Repository", () => {

  const makeSut = (): AccountPostgresRepository => {
    return new AccountPostgresRepository();
  };
  test("Should return an account on sucess", async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@email.com");
    expect(account.password).toBe("any_password");
  });
});
