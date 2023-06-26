const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const reactSchema = new mongoose.Schema({
  react: {
    type: String,
    enum: ["like", "love", "haha", "sad", "angry", "wow"],
    required: true,
  },
  postRef: {
    type: ObjectId,
    ref: "Post",
  },
  reactBy: {
    type: ObjectId,
    ref: "User",
  },
});

exports.React = mongoose.model("React", reactSchema);
