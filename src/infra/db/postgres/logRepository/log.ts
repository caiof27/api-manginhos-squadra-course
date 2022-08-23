import { LogErrorRepository } from "../../../../data/protocols/logErrorRepository";
import Log from "../models";

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    await Log.Create({
      stack,
      date: new Date()
  })
  }
}
