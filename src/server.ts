import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
import app from "./app";

const DB = process.env.DATABASE!.replace("<PASSWORD>", process.env.DATABASE_PASSWORD!);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("App running on port " + port);
});
