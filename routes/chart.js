const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const chartController = require("../controllers/chart");
// const { ensureAuth } = require("../middleware/auth");

router.post("/putChart",  upload.none(), chartController.putChart);

//the route could be /:id if you want multiple charts. But I start with just one.
router.get("/getChart", chartController.getChart);

module.exports = router;
