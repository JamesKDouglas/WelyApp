const mongoose = require("mongoose");
//Write now I'm basically just using this as a state. But later I want to actually store data in here. A 'chart' will contain the telemetry data the device sends and also have visualization information attached? 
//Anyways an intermediary may be just to use this to store multiple chart configurations.
const chartSchema = new mongoose.Schema({
  channelid: {
    type: String,
    required: true,
  },
  writeapi: {
    type: String,
    require: true,
  },
  numpoints: {
    type: Number,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Chart", chartSchema);
