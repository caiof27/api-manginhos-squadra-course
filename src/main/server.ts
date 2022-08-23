import env from "./config/env";
import db from "../infra/db/postgres/models/index"



db.sequelize.sync()
  .then(async () => {
    const app = (await import("./config/app")).default;
    app.listen(env.port, () =>
      console.log(`Server Running at http://localhost:${env.port}`)
    );
  })
  .catch(console.error);
