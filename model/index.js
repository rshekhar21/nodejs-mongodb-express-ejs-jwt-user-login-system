const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const log = console.log;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: [true, "Email already exists"],
    lowercase: true,
    validate: [isEmail, "must be a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minlength: [6, "Passwrod must be at least 6 characters long"],
  },
  role: {
    type: String,
    default: "USER",
    upperCase: true,
  },
});

userSchema.post("save", function (doc, next) {
  // log("new user created", this);
  next();
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

userSchema.statics.changePassword = async function (id, password) {
  const user = await this.findById(id);
  if (user) {
    const salt = await bcrypt.genSalt();
    const pwd = await bcrypt.hash(password, salt);
    const result = await this.findByIdAndUpdate(id, { password: pwd });
    if (result) return result;
    throw Error("password not chagned");
  }
  throw Error("password not chagned");
};

const User = mongoose.model("user", userSchema);
module.exports = User;
