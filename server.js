const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

connectDB();

app.use("/api/user",require("./routes/API/register"));
app.use("/api/post",require("./routes/API/post"));
app.use("/api/register",require("./routes/API/home"));

app.get("/",(req,res)=>{
    res.send("This is Pull Up")
});

app.listen(PORT, ()=>{
    console.log(" ===> Listening to PORT " + PORT)
});
