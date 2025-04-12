const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const ContactForm = require("../models/ContactForm.js");

router.get("/", async (req, res) => {
  try {
    const { userStatus } = req;
    res.render("contact", userStatus);
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
    body("name")
      .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
      .isLength({ max: 30, min: 2 }),
    body("email").isEmail(),
    body("message").isLength({ min: 50, max: 500 })
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty())
        return res.status(404).render("error", {
          error: "Invalid request",
          message: `${result.errors.length} invalid values, please provide correct values`
        });
      const { name, email, message } = req.body;
      await ContactForm.create({ name: name, email: email, message: message });
      res.redirect("/contact");
    } catch (error) {
      res.render("error", {
        error: "Server side error occurred",
        message: error
      });
    }
  }
);

module.exports = router;
