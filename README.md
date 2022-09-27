# About

This app is a development project with the 100Devs agency.

It collects data from an Internet of Things device, and allows the user to look at the data. The device is a "weighing lysimeter", a scientific device used to monitor the water content of a potted plant. The product is called a Wely Device and was developed by Phytochem Consulting in Vancouver, Canada.

The app adds a social media component to the typical IoT dashboard. This builds a "citizen science" platform where people can work together to build knowledge about how to take care of plants. 

Major components that the app uses are Node.js for the back end, Express.js to make Node programming easier, Chart.js to chart the data. EJS is used to create HTML to serve to the user and a MongoDB database to store user, social media and telemetry data. 


# Install

`npm install`

---

# Things to add

- Create a `.env` file in config folder and add the following as `key = value`
  - PORT = 2121 (can be any port example: 3000)
  - DB_STRING = `your database URI`
  - CLOUD_NAME = `your cloudinary cloud name`
  - API_KEY = `your cloudinary api key`
  - API_SECRET = `your cloudinary api secret`

---

# Run

`npm start`
