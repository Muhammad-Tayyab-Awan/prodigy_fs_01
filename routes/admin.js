const router = require("express").Router();
const { param, validationResult } = require("express-validator");
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
    userStatus.data = {
      allUsers: await User.find({ role: "user" }).select("-password")
    };
    res.render("users", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

router.get("/admins", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!(userStatus.role === "admin"))
      return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
    userStatus.data = {
      allAdmins: await User.find({ role: "admin" }).select("-password")
    };
    res.render("admins", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

router.get(
  "/users/delete/:userId",
  param("userId").isMongoId(),
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (!(userStatus.role === "admin"))
        return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
      const result = validationResult(req);
      if (!result.isEmpty())
        return res.status(404).render("error", {
          error: "Invalid request",
          message: `${result.errors.length} invalid values, please provide correct values`
        });
      const { userId } = req.params;
      const userExist = await User.findById(userId);
      if (!userExist)
        return res.render("error", {
          error: "Invalid request",
          message: "No user exist with such id"
        });
      if (userExist.role !== "user")
        return res.render("error", {
          error: "Invalid request",
          message: "No user exist with such id"
        });
      await User.findByIdAndDelete(userId);
      res.redirect("/admin/users");
    } catch (error) {
      res.render("error", {
        error: "Server side error occurred",
        message: error
      });
    }
  }
);

router.get(
  "/users/verify/:userId",
  param("userId").isMongoId(),
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (!(userStatus.role === "admin"))
        return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
      const result = validationResult(req);
      if (!result.isEmpty())
        return res.status(404).render("error", {
          error: "Invalid request",
          message: `${result.errors.length} invalid values, please provide correct values`
        });
      const { userId } = req.params;
      const userExist = await User.findById(userId);
      if (!userExist)
        return res.render("error", {
          error: "Invalid request",
          message: "No user exist with such id"
        });
      if (userExist.role !== "user")
        return res.render("error", {
          error: "Invalid request",
          message: "No user exist with such id"
        });
      if (userExist.verified)
        return res.render("error", {
          error: "Invalid request",
          message: "User already verified"
        });
      userExist.verified = true;
      await userExist.save();
      res.redirect("/admin/users");
    } catch (error) {
      res.render("error", {
        error: "Server side error occurred",
        message: error
      });
    }
  }
);

router.get(
  "/admins/delete/:userId",
  param("userId").isMongoId(),
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (!(userStatus.role === "admin"))
        return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
      const result = validationResult(req);
      if (!result.isEmpty())
        return res.status(404).render("error", {
          error: "Invalid request",
          message: `${result.errors.length} invalid values, please provide correct values`
        });
      const { userId } = req.params;
      const userExist = await User.findById(userId);
      if (!userExist)
        return res.render("error", {
          error: "Invalid request",
          message: "No admin exist with such id"
        });
      if (userExist.role !== "admin")
        return res.render("error", {
          error: "Invalid request",
          message: "No admin exist with such id"
        });
      let allAdmins = await User.find({ role: "admin" }).select("-password");
      if (allAdmins.length === 1)
        return res.render("error", {
          error: "Operation failed",
          message:
            "You are the only admin so you can't delete your account, in order to delete first add another admin"
        });
      await User.findByIdAndDelete(userId);
      res.redirect("/admin/admins");
    } catch (error) {
      res.render("error", {
        error: "Server side error occurred",
        message: error
      });
    }
  }
);

router.get("/add", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!(userStatus.role === "admin"))
      return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
    res.render("add", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

module.exports = router;
