const router = require("express").Router();
const User = require("../models/Users.js");

router.get("/", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) return res.redirect("/login");
    const userInfo = await User.findById(userStatus.userId);
    userStatus.email = userInfo.email;
    userStatus.joinedOn = new Date(userInfo.createdAt).toUTCString();
    res.render("profile", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

router.get("/delete", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) return res.redirect("/login");
    await User.findByIdAndDelete(userStatus.userId);
    res.clearCookie("roluthentify_auth_token");
    res.redirect("/");
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

module.exports = router;
