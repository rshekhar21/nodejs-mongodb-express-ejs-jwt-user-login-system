const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middleware");

require("dotenv").config();

const app = express();
const log = console.log;
const port = process.env.PORT || 3000;
const cnstr = process.env.MDB_CNSTR;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/api", router);

app.set("view engine", "ejs");

app.get("*", checkUser);
app.get("/", (req, res) => {
  // res.send("welcome from server");
  res.render("index");
});
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/about", (req, res) => res.render("about"));
app.get("/contact", (req, res) => res.render("contact"));
app.get("/chngpwd", (req, res) => res.render("chpwd"));
app.get("/fgotpwd", (req, res) => res.render("fgotpwd"));

mongoose
  .connect(cnstr, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    log("mongodb connected");
    app.listen(port, () => log(`server running on http://localhost:${port}`));
  })
  .catch((err) => {
    log(err.message);
  });
