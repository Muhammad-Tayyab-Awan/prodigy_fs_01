const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./utils/connectDB");
const verifyLogin = require("./middleware/verifyLogin.js");
const registerRoute = require("./routes/auth/register.js");
const loginRoute = require("./routes/auth/login.js");
const logoutRoute = require("./routes/auth/logout.js");
const contactRoute = require("./routes/contact.js");
const profileRoute = require("./routes/profile.js");
const adminRoute = require("./routes/admin.js");
const guideRoute = require("./routes/guide.js");
const PORT = process.env.PORT || 3000;
const { input, password } = require("@inquirer/prompts");
const bcrypt = require("bcryptjs");
const User = require("./models/Users.js");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(verifyLogin);

app.get("/", (req, res) => {
  try {
    const { userStatus } = req;
    res.render("index", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Sever side error occurred",
      message: error
    });
  }
});

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/contact", contactRoute);
app.use("/profile", profileRoute);
app.use("/admin", adminRoute);
app.use("/guide", guideRoute);

app.get("/files/guide.pdf", (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) return res.redirect("/login");
    res.sendFile(path.join(__dirname, "/files/guide.pdf"));
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

app.all(/(.*)/, (req, res) => {
  const pageRequested = req.path.slice(1);
  res.render("not-found", { pageRequested });
});

app.listen(PORT, async () => {
  console.clear();
  console.log(`Server is running on http://localhost:${PORT}`);
  if (connectDB()) {
    console.log("Connected to DB");
    const adminUsers = await User.findOne({ role: "admin", verified: true });
    if (!adminUsers) {
      let userData = {};
      userData.username = await input({ message: "Enter username here : " });
      userData.email = await input({ message: "Enter email here : " });
      userData.password = await password({ message: "Enter password here : " });
      userData.role = "admin";
      userData.verified = true;
      userData.password = bcrypt.hashSync(
        userData.password,
        await bcrypt.genSalt(10)
      );
      await User.create(userData);
      console.log("Admin created");
    }
  } else {
    console.log("DB connection failed");
  }
});
