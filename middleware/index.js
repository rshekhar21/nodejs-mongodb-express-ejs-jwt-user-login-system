require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model");
const log = console.log;
const jwtKey = process.env.JWT_SECRET_KEY;

const authRout = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtKey, (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        if (req.path == "/chpwd") {
          req.token = decodedToken.id;
        }
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtKey, async (err, decodedToken) => {
      if (err) {
        res.locals.user = "Guest";
        next();
      } else {
        const userid = decodedToken.id;
        const user = await User.findById(userid);
        res.locals.user = user.email;
        next();
      }
    });
  } else {
    res.locals.user = "Guest";
    next();
  }
};

module.exports = { authRout, checkUser };
