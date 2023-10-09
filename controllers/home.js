module.exports = {
  getInvest: (req, res) => {
    res.render("invest.ejs");
  },
  getSplash: (req, res) => {
    res.render("splash.ejs");
  },
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
};
