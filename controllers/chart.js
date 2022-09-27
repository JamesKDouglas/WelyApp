// const cloudinary = require("../middleware/cloudinary");
const Chart = require("../models/Chart");

module.exports = {
  putChart: async (req, res) => {
    console.log("chart put method called!") ;
    try {
      //Note that with this method every user must be granted a default chart record upon signing up. This MongoDB method cannot create records, only update those that already exist.
      //I try to use upsert to change that.
      // console.log(`update chart with the infor: chanellID: ${req.body.channelid}, writeAPI: ${req.body.writeapi}, numpoints: ${req.body.numpoints}`);
      console.log(req.body);
      await Chart.findOneAndUpdate({user: req.user.id},{
        channelid: req.body.channelid,
        writeapi: req.body.writeapi,
        numpoints: req.body.numpoints,
      }, {upsert: true});

      console.log("chart parameters have been modified!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  getChart: async (req, res) => {
    try {
      const chart = await Chart.findById(req.params.id);
      res.render("profile.ejs", { chart: chart, post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
};
