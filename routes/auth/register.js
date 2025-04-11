const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const User = require("../../models/Users.js");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    const { userStatus } = req;
    if (userStatus.loggedIn) {
      return res.redirect("/");
    }
    res.render("register");
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

router.post(
  "/",
  [
    body("username")
      .matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]+$/)
      .isLength({ min: 6, max: 20 }),
    body("email").isEmail(),
    body("password")
      .isStrongPassword({
        minLowercase: 3,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 1,
        minLength: 8
      })
      .isLength({ max: 18 })
  ],
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (userStatus.loggedIn) return res.redirect("/");
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(404).render("error", {
          error: "Invalid request",
          message: `${result.errors.length} invalid values, please provide correct values`
        });
      }
      const { username, email, password } = req.body;
      const usernameExist = await User.findOne({ username: username });
      const userEmailExist = await User.findOne({ email: email });
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
      const hashedPassword = bcrypt.hashSync(
        password,
        await bcrypt.genSalt(10)
      );
      await User.create({
        username,
        email,
        password: hashedPassword
      });
      res.status(200).redirect("/login");
    } catch (error) {
      return res.render("error", {
        error: "Server side error occurred",
        message: error
      });
    }
  }
);

module.exports = router;
