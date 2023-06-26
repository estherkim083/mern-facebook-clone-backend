const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//database

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "clone",
  })
  .then((res) => {
    console.log("database connection is ready");
  })
  .catch((err) => {
    console.log(err.message);
  });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}..`);
});
