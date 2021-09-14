const express = require("express");
const router = express.Router();
const { authRout } = require("../middleware");

const {
  create,
  read,
  updaterec,
  delrec,
  show,
  login,
  logout,
  chngpwd,
} = require("../controller");

module.exports = router;

router.post("/create", create);
router.get("/read", read);
router.post("/update", updaterec); // user authRout
router.post("/delete", delrec); // user authRout
router.get("/find", show);
router.post("/login", login);
router.get("/logout", logout);
router.post("/chpwd", authRout, chngpwd); //authRout,
