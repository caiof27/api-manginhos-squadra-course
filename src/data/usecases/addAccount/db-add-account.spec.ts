import {
  AccountModel,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
});

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountRepositoryStub();
};

interface sutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountReposityStub: AddAccountRepository;
}

const makeSut = (): sutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountReposityStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountReposityStub);
  return { sut, encrypterStub, addAccountReposityStub };
};
describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.add(makeFakeAccountData());
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
  test("Should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });
  test("Should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountReposityStub } = makeSut();
    const addSpy = jest.spyOn(addAccountReposityStub, "add");
    await sut.add(makeFakeAccountData());
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });
  test("Should throw if Encrypter throws", async () => {
    const { sut, addAccountReposityStub } = makeSut();
    jest
      .spyOn(addAccountReposityStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });
  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });
});
