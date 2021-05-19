const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.use("/api/user", require("./routes/API/home"));
app.use("/api/auth", require("./routes/API/auth"));
app.use("/api/register", require("./routes/API/register"));

app.get("/", (req, res) => {
  res.send("This is Pull Up");
});

app.listen(PORT, () => {
  console.log(" ===> Listening to PORT " + PORT);
});
