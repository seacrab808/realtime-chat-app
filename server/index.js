const express = require("express");
const cors = require("cors"); // FE랑 소통
const mongoose = require("mongoose");

const app = express(); // app으로 express 사용
require("dotenv").config();

// 미들웨어?
app.use(express.json()); //json 데이터
app.use(cors());

// create -> app.post
// read -> app.get
// use -> app.put
// delete -> app.delete

app.get("/", (req, res) => {
  res.send("Welcome our chat app APIs..");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection failed: ", error.message));
