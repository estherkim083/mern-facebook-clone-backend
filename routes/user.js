const express = require("express");
const {
  register,
  activateAccount,
  login,
  auth,
  sendverification,
} = require("../controllers/user");
const { authUser } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);

router.post("/activate", authUser, activateAccount);

router.post("/login", login);

router.post("/auth", authUser, auth);
router.post("/sendverification", authUser, sendverification);

module.exports = router;
