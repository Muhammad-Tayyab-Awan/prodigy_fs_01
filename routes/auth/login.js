const router = require("express").Router();

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

module.exports = router;
