import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

describe("Signup Routes Middleware", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany();
  });
  test("Should return an account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Caio",
        email: "caio.feijao@squadra.com.br",
        password: "teste",
        passwordConfirmation: "teste",
      })
      .expect(200);
  });
});