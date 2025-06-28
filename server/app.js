const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");

// setup middlewares
app.use(cors());
app.use(express.json());

//base routes
app.get("/", (req, res) => {
  return res.json({ message: "welcome to script reader" });
});

module.exports = app;
