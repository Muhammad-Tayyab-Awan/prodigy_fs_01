const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./utils/connectDB");
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  try {
    res.render("index", { loggedIn: false });
  } catch (error) {
    res.render("error", {
      error: "Sever side error occurred",
      message: error
    });
  }
});

app.all(/(.*)/, (req, res) => {
  const pageRequested = req.path.slice(1);
  console.log(pageRequested);
  res.render("not-found", { pageRequested });
});

app.listen(PORT, async () => {
  console.clear();
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB()
    ? console.log("Connected to DB")
    : console.log("DB connection failed");
});
