const jwt = require("jsonwebtoken");

exports.authUser = async (req, res, next) => {
  try {
    let token = req.header("Authorization").split(" ")[1];
    if (!token) {
      console.log("no token", token);
      return res.status(400).json({ message: "invalid authentication" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err.message, token);
        return res.status(400).json({ message: "invalid authentication" });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
