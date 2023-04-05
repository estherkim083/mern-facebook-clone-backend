const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validations");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail } = require("../helpers/mailer");
const jwt = require("jsonwebtoken");

exports.sendverification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified) {
      return res.status(400).json({
        message: "This account is already authenticated",
      });
    }
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate?token=${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res.status(200).json({
      message: "Email verification link has been send to your email.",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.auth = async (req, res) => {
  res.send("welcome from auth");
  console.log(req.user);
};

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      bMonth,
      bYear,
      gender,
      password,
      email,
      bDay,
    } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    const check = await User.findOne({ email });
    if (check) {
      return res
        .status(400)
        .json({ message: "the email address already exists." });
    }
    if (!validateLength(first_name, 3, 30)) {
      return res
        .status(400)
        .json({ message: "first name must be between 3 and 30 chars." });
    }
    if (!validateLength(last_name, 3, 30)) {
      return res
        .status(400)
        .json({ message: "last name must be between 3 and 30 chars." });
    }
    if (!validateLength(password, 6, 30)) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters long." });
    }
    const cryptedPassword = await bcrypt.hash(password, 12);

    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);
    let user = new User({
      username: newUsername,
      first_name,
      last_name,
      bMonth,
      bYear,
      gender,
      password: cryptedPassword,
      email,
      bDay,
    });
    user = await user.save();
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate?token=${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    const token = generateToken({ id: user._id.toString() }, "7d");

    res.send({
      id: user._id.toString(),
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token,
      verified: user.verified,
      message: "Register Sucess | please activate your email to start.",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);

    if (validUser !== user.id) {
      return res.status(400).json({
        message: "You don't have the authorization to complete this operation.",
      });
    }

    if (check.verified == true) {
      return res
        .status(400)
        .json({ message: "This email is Already verified" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: "The account has been activated successfully." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "The email address doesn't exist" });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res
        .status(400)
        .json({ message: "Invalid credentials. Please try again." });
    }
    const token = generateToken({ id: user._id.toString() }, "7d");

    res.send({
      id: user._id.toString(),
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token,
      verified: user.verified,
      message: "Login Sucess",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
