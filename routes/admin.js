const router = require("express").Router();
const { param, validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/Users.js");
const ContactForm = require("../models/ContactForm.js");

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

router.post(
  "/admins/add",
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
      if (!(userStatus.role === "admin"))
        return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
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
        password: hashedPassword,
        role: "admin",
        verified: true
      });
      res.status(200).redirect("/admin/admins");
    } catch (error) {
      res.render("error", {
        error: "Server side error occurred",
        message: error
      });
    }
  }
);

router.get("/contact-forms", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!(userStatus.role === "admin"))
      return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
    const contactForms = await ContactForm.find();
    userStatus.data = { contactForms };
    res.render("contact-forms", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

router.get(
  "/contact-forms/delete/:formId",
  param("formId").isMongoId(),
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (!(userStatus.role === "admin"))
        return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(404).render("error", {
          error: "Invalid request",
          message: `${result.errors.length} invalid values, please provide correct values`
        });
      }
      const { formId } = req.params;
      const formExist = await ContactForm.findById(formId);
      if (!formExist)
        return res.render("error", {
          error: "Invalid request",
          message: "No contact form exist with such id"
        });
      await ContactForm.findByIdAndDelete(formId);
      res.redirect("/admin/contact-forms");
    } catch (error) {
      res.render("error", {
        error: "Server side error occurred",
        message: error
      });
    }
  }
);

router.get("/update-guide", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!(userStatus.role === "admin"))
      return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
    res.render("update-guide", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

module.exports = router;
