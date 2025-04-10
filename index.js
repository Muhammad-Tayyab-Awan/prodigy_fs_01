const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.all(/(.*)/, (req, res) => {
  res.send("Not valid");
});

app.listen(PORT, () => {
  console.clear();
  console.log(`Server is running on http://localhost:${PORT}`);
});
