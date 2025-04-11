const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const User = require("../models/Users.js");

const verifyLogin = (req, res, next) => {
  try {
    const { cookies } = req;
    const authToken = cookies["roluthentify_auth_token"];
    if (!authToken) {
      req.userStatus = { loggedIn: false };
      return next();
    }
    jwt.verify(authToken, jwtSecret, async (err, decodedToken) => {
      if (err) {
        req.userStatus = { loggedIn: false };
        return next();
      }
      const { userId } = decodedToken;
      const userExist = await User.findById(userId);
      if (!(userExist && userExist.verified)) {
        req.userStatus = { loggedIn: false };
        return next();
      }
      req.userStatus = {
        loggedIn: true,
        userId: userId,
        role: userExist.role,
        username: userExist.username
      };
      return next();
    });
  } catch (error) {
    res.render("error", {
      error: "Sever side error occurred",
      message: error
    });
  }
};
module.exports = verifyLogin;
