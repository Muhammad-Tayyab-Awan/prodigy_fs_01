const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!(userStatus.role === "admin"))
      return res.redirect(`/${userStatus.loggedIn ? "profile" : "login"}`);
    res.render("admin", userStatus);
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});

module.exports = router;
