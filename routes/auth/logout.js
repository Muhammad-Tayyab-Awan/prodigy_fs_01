const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) return res.redirect("/");
    res.clearCookie("roluthentify_auth_token", { secure: true });
    res.redirect("/login");
  } catch (error) {
    res.render("error", {
      error: "Server side error occurred",
      message: error
    });
  }
});
module.exports = router;
