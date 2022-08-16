import { AccountModel } from "../../domain/models/account";
import { AddAccountModel } from "../../domain/usecases/addAccount/add-account";

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}
