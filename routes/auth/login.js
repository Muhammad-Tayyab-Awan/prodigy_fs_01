const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users.js");
const jwtSecret = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  try {
    const { userStatus } = req;
    if (userStatus.loggedIn) {
      return res.redirect("/");
    }
    res.render("login");
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
    body("email").isEmail(),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 3,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 1
      })
      .isLength({ max: 18 }),
    body("rememberMe").isIn(["true"]).optional()
  ],
  async (req, res) => {
    const { userStatus } = req;
    if (userStatus.loggedIn) return res.redirect("/");
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(404).render("error", {
        error: "Invalid request",
        message: `${result.errors.length} invalid values, please provide correct values`
      });
    }
    const { email, password, rememberMe } = req.body;
    const userCheck = await User.findOne({ email: email });
    if (!userCheck)
      return res.status(404).render("error", {
        error: "Invalid request",
        message: "Please enter correct credentials"
      });
    const passwordCompared = await bcrypt.compare(password, userCheck.password);
    if (!passwordCompared)
      return res.status(404).render("error", {
        error: "Invalid request",
        message: "Please enter correct credentials"
      });
    if (!userCheck.verified)
      return res.status(404).render("error", {
        error: "Account verification pending",
        message:
          "Your account is not verified by admins yet, please wait for account verification"
      });
    const authToken = jwt.sign({ userId: userCheck.id.toString() }, jwtSecret);
    if (rememberMe) {
      res.cookie("roluthentify_auth_token", authToken, {
        maxAge: 2592000000,
        secure: true
      });
    } else {
      res.cookie("roluthentify_auth_token", authToken, { maxAge: 60000 });
    }
    res.redirect("/");
    try {
    } catch (error) {
      res.render("error", {
        error: "Server side error occurred",
        message: error
      });
    }
  }
);

module.exports = router;
