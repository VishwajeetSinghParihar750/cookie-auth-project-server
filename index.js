const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { readdirSync } = require("fs");

let morgan = require("morgan");
require("dotenv").config();

mongoose
  .connect(process.env.DATABASE, {
    dbName: "authProjectDB",
  })
  .then(() => console.log("DB CONNECTED ... "))
  .catch((e) => console.log(e));

const app = express();

// middlewares
app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http:localhost:3000",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin(origin, cb) {
      cb(null, origin);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev")); // gives data about incoming requests on console

//routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
// this will set all routes , no need to do it manually now

let port = process.env.port || 8000;

app.listen(port, (err) => console.log(`working on port : ${port}`));
