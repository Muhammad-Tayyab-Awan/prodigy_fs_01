const router = require("express").Router();
const User = require("../models/Users.js");

router.get("/", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!(userStatus.role === "admin"))
      return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
    let totalMembers = await User.find();
    totalMembers = totalMembers.length;
    let verifiedUsers = await User.find({ verified: true, role: "user" });
    verifiedUsers = verifiedUsers.length;
    let totalAdmins = await User.find({ role: "admin" });
    totalAdmins = totalAdmins.length;
    userStatus.data = { totalMembers, verifiedUsers, totalAdmins };
    res.render("admin", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!(userStatus.role === "admin"))
      return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
    userStatus.data = { allUsers: await User.find().select("-password") };
    res.render("users", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

module.exports = router;
