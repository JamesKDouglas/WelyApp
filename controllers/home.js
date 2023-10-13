const Post = require("../models/Post");

module.exports = {
  getInvest: (req, res) => {
    res.render("invest.ejs");
  },
  getSplash: async (req, res) => {
    try {
      const posts = await Post.find().limit(5).sort({ createdAt: "desc" }).lean();
      res.render("splash.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
};
