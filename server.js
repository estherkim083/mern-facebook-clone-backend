const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const app = express();
app.use(express.json());
app.use("/public/images", express.static(__dirname + "/public/images"));
let allowed = ["http://localhost:5173", "http://localhost:8000"];

function options(req, res) {
  let tmp;
  let origin = req.header("Origin");
  if (allowed.indexOf(origin) > -1) {
    tmp = {
      origin: true,
      optionSuccessStatus: 200,
    };
  } else {
    tmp = {
      origin: false,
    };
  }
  res(null, tmp);
}
app.use(cors(options));
app.use(fileUpload({ useTempFiles: true }));

readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

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
  console.log("http://localhost:8000");
  console.log("listening on port 8000");
});
