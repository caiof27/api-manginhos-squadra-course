import { AddAccountRepository } from "../../../../data/protocols/addAccountRepository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/addAccount/add-account";
import Account from "../models";


export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const result = await Account.Create(accountData);
    return result;
  }
}
