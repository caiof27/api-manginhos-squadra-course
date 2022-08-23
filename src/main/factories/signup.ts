import { DbAddAccount } from "../../data/usecases/addAccount/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/postgres/account-repository/account";
import { LogMongoRepository } from "../../infra/db/postgres/logRepository/log";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { logControllerDecorator } from "../decorators/log";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAccount = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    emailValidatorAccount,
    dbAddAccount
  );
  const logMongoRepository = new LogMongoRepository();
  return new logControllerDecorator(signUpController,logMongoRepository);
};
