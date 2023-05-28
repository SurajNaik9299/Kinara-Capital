require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const cors = require("cors");

const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;

connectDB();

app.use(cors());
app.use(express.json());

// app.use(cookieParser());

//TO find static files such as css files
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/students", require("./routes/studentRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to Mongoose");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// mongoose.connection.on("error", (err) => {
//   console.log(err);
//   logEvents(
//     `${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,
//     "mongoErrorLog.log"
//   );
// });
