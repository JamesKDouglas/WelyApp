const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const chartRoutes = require("./routes/chart");

const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 150,
});
app.use(limiter);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],
      "img-src":[ "'self'", "data:", "http://res.cloudinary.com"], 
      "connect-src":["https://api.thingspeak.com/"],
    },
  }),
);

//Use .env file in config folder
//THIS DOES NOT WORK IN GOOGLE RUN! It works fine in a docker container locally but not with google's gcloud build run command.
// For google run I had to copy and paste the environment variables in through the gui 1/2 at a time and it was as horrible as it sounds. 
require("dotenv").config({ path: __dirname+"./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/chart", chartRoutes);

//Server Running

app.listen(process.env.PORT, () => {
  console.log("DB_STRING", process.env.DB_STRING);
  console.log("PORT", process.env.PORT);
  console.log("CLOUDINARY", process.env.CLOUD_NAME);
  console.log("KEY", process.env.API_KEY);
  console.log("SEC", process.env.API_SECRET);
  console.log("Node env", process.env.NODE_ENV);
  console.log("Server is running, you better catch it!");
});
