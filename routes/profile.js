const router = require("express").Router();
const { body, validationResult } = require("express-validator");
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
    if (userStatus.role === "admin") {
      let adminCount = await User.find({ role: "admin" });
      adminCount = adminCount.length;
      if (adminCount === 1)
        return res.render("error", {
          error: "Operation failed",
          message:
            "You are the only admin so you can't delete your account, in order to delete first add another admin"
        });
    }
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

router.post(
  "/update",
  [
    body("username")
      .matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]+$/)
      .isLength({ min: 6, max: 20 })
      .optional(),
    ,
    body("email").isEmail().optional()
  ],
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (!userStatus.loggedIn) return res.redirect("/login");
      const result = validationResult(req);
      if (!result.isEmpty())
        return res.status(404).render("error", {
          error: "Invalid request",
          message: `${result.errors.length} invalid values, please provide correct values`
        });
      for (const element in req.body) {
        if (!(element === "username" || element === "email"))
          delete req.body[element];
      }
      const usernameExist = await User.findOne({ username: req.body.username });
      const userEmailExist = await User.findOne({ email: req.body.email });
      if (userEmailExist && usernameExist)
        return res.status(404).render("error", {
          error: "Invalid request",
          message: `User already exist with this email and username`
        });
      if (usernameExist || userEmailExist)
        return res.status(404).render("error", {
          error: "Invalid request",
          message: `User already exist with this ${
            usernameExist ? "username" : "email"
          }`
        });
      await User.findByIdAndUpdate(userStatus.userId, req.body);
      res.redirect("/profile");
    } catch (error) {
      res.render("error", {
        error: "Server side error occurred",
        message: error
      });
    }
  }
);

module.exports = router;
