const express = require("express");
const { register, login, logout } = require("../controllers/auth");
const { verifyLogin } = require("../middlewares/index");

let router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", verifyLogin, logout);
router.get(
  "/verifyLogin",

  verifyLogin,
  (req, res) => {
    res.status(200).send(req.data);
  }
);

module.exports = router;
