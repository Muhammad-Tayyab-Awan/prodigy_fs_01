const router = require("express").Router();

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

module.exports = router;
