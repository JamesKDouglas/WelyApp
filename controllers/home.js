const Post = require("../models/Post");

module.exports = {
  getInvest: async (req, res) => {
    try {
      const posts = await Post.find().limit(5).sort({ createdAt: "desc" }).lean();
      res.render("invest.ejs", { posts: posts.slice(0,2) });
    } catch (err) {
      console.log(err);
    }
  },
  getDevices: async (req, res) => {
    try {
      const posts = await Post.find().limit(5).sort({ createdAt: "desc" }).lean();
      res.render("devices.ejs", { posts: posts.slice(0,2) });
    } catch (err) {
      console.log(err);
    }
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
