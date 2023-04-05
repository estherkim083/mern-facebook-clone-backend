const { User } = require("../models/User");

exports.validateEmail = (email) => {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return String(email).toLowerCase().match(validRegex);
};

exports.validateLength = (text, min, max) => {
  if (text.length > max || text.length < min) return false;
  else return true;
};

exports.validateUsername = async (username) => {
  let check = await User.findOne({ username });
  if (check) {
    // change username
    username += (+new Date() * Math.random()).toString().substring(0, 3);
  }
  return username;
};
