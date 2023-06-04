const { Post } = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "first_name last_name gender username picture")
      .sort({ createdAt: "desc" });
    res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
