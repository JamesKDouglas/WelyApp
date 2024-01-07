// import { BarWithErrorBarsController, BarWithErrorBar } from 'chartjs-chart-error-bars';
// const {BarWithErrorBarsController} = require('chartjs-chart-error-bars');

// const { MongoClient } = require('mongodb');

// // Connection URL
// const url = 'https://us-west-2.aws.data.mongodb-api.com/app/data-akvsn/endpoint/data/v1/';//action/findOne cut off. Should it be?
// const client = new MongoClient(url);

// // Database Name
// const dbName = 'Cluster0';

// async function main() {
//   // Use connect method to connect to the server
//   await client.connect();
//   console.log('Connected successfully to server');
//   const db = client.db(dbName);
//   const collection = db.collection('documents');

//   // the following code examples can be pasted here...

//   return 'done.';
// }

// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => client.close());

// let chartInfo = document.getElementById("script").getAttribute('chartInfo');
// chartInfo = JSON.parse(chartInfo);
// console.log("chartInfo:", chartInfo);

// // let channelId = chartInfo[0].channelid;//Wely 8
// // let api = chartInfo[0].writeapi;
// // let numpoints = chartInfo[0].numpoints;
// // let field = chartInfo[0].field;


// // curl --location --request POST 'https://us-west-2.aws.data.mongodb-api.com/app/data-akvsn/endpoint/data/v1/action/findOne' \
// // --header 'Content-Type: application/json' \
// // --header 'Access-Control-Request-Headers: *' \
// // --header 'api-key: 9wf7d5Oo831YzFuO0d3YPHUKkJhPeMXhmuhPMM02IxKH8Ius77VGoskVjfQXWNIO' \
// // --data-raw '{
// //     "collection":"TimeSeries.Gray1",
// //     "database":"Cluster0",
// //     "dataSource":"Cluster0",
// //     "projection": {"_id": 1}
// // }'

// let someData = getDataMongo(key, numpoints, fields);

// someData.then(response => {
//   console.log('returned object', response);
//   makeChart(response.feeds, response.channel.name);
// });

// async function getDataMongo(key, numpoints, fields){
//   // api ref https://www.mathworks.com/help/thingspeak/readdata.html
//   //default format
//   //default #results
//   //url: https://api.thingspeak.com/channels/<channel_id>/feeds.<format>
//   //append query string params:api_key, # results
//   // ex https://api.thingspeak.com/channels/9/feeds.json?results=3
//   let format = "json";
//   let numResults = numpoints;
//   // let dataURL = "https://api.thingspeak.com/channels/" + channelId + "/feeds." + format + "?results=" + numResults + "?api_key=" + api;
//  let dataURL = "https://us-west-2.aws.data.mongodb-api.com/app/data-akvsn/endpoint/data/v1/action/findOne";
  
//   console.log(dataURL);
//   console.log("field:", fields);

//   //in thingspeak we request fields. In Mongodb you request documents
//   //so all fields will be provided.
//   // if (fields.find(el => el==="mass")){
//   //   console.log("mass data requested!");
//   //   localStorage.setItem("field", "field1");//?
//   // } else if (field === "temperature"){
//   //   console.log("temperature selected!");
//   //   localStorage.setItem("field", "field3")
//   // }

//   //The mongodb api isn't this simple. 
//   // try{
//   //   const res = await fetch(dataURL)
//   //   const data = await res.json();
//   //   return data;
//   // }
//   // catch{
//   //   throw new Error("uh Oh!")
//   // } 
  
// }

fetch('https://realm.mongodb.com/api/client/v2.0/app/data-akvsn/auth/providers/api-key/login', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      'key': '9wf7d5Oo831YzFuO0d3YPHUKkJhPeMXhmuhPMM02IxKH8Ius77VGoskVjfQXWNIO'
  })
}).then(response => response.text())
.then(result => {
  console.log(result);
  let bearerKey = JSON.parse(result).access_token;
  getData(bearerKey);
})
.catch(error => console.log('error', error));

async function getData(bearerKey){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  myHeaders.append("Access-Control-Request-Headers", "*");
  myHeaders.append("Authorization", `Bearer ${bearerKey}`)

  var raw = JSON.stringify({
      "collection":"TimeSeries.Gray1",
      "database":"Cluster0",
      "dataSource":"Cluster0",
      "sort": {"time": -1},
      "limit": 100
  });

  var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  fetch("https://us-west-2.aws.data.mongodb-api.com/app/data-akvsn/endpoint/data/v1/action/find", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        console.log("helo");
        result = JSON.parse(result);
        console.log(result.documents[0]);
        let temperature = result.documents.map(el => el.sensors.temperature);
        let massADC = result.documents.map(el => el.sensors.massADC);
        let massInternalCal = result.documents.map(el => el.sensors.mass);
        let timeStamp = result.documents.map(el => el.time);
        console.log("temperature:", temperature);
        console.log("adcReading:", massADC);
        console.log("massInternalCal:", massInternalCal);
        console.log("timeStamp:", timeStamp);

        //data array has to follow the form data = [{x:"timestamp", y:"value"}]
        let point;
        let data = [];
        for (let i=0;i<temperature.length; i++){
          point = {'x':`${timeStamp[i]}`, 'y': `${massADC[i]}`};
          data.push(point);
        }
        makeChart(data, "My awesome chart");
      })
      .catch(error => console.log('error', error));
}

function makeChart(data, name){
 let dataArr = data;
 let yTitle = "Mass (g)";
  // // let dataType = document.getElementsByName('data_type');
  // // console.log("data type selected to chart:", dataType);

  // //change the field names

  // let field = localStorage.getItem("field");
  // console.log("retrieved fieldname:", field);
  // let newData = {};

  // //One way to show temperature data is to tweak this.
  // //I feel like I could do this in a more direct fashion without the if statements,
  // //but I notice I can't just use the variable directly inside the curly brackets  must be a scope issue.
  // let yTitle = "Mass (g)";
  // if (field === "field3"){
  //   //field 3 is temperature
  //   newData = data.map(({"created_at": x, "field3": y}) => ({
  //     x,  y,
  //   }));
  //   yTitle = "Temperature (deg C)";
  // } else {
  //   //field 1 is mass
  //   newData = data.map(({"created_at": x, "field1": y}) => ({
  //     x,  y,
  //   }));
    
  // }

  // console.log(newData);

  // let dataArr = [];
  // newData.forEach((el) => dataArr.push({"x":el.x,"y": Number(el.y), "yMax":Number(el.y)+2, "yMin":Number(el.y)-2}));

  console.log(dataArr);

  var ctx = document.getElementById("Chart").getContext("2d");

  var myChart = new Chart(ctx, {
    type: 'scatterWithErrorBars',
    data: {
      datasets: [{
        // fill: true,
        // type: 'line',
        label: 'Mass of Coffee Tree',
        data: dataArr,
        backgroundColor: 'rgb(255, 99, 132)'
      }],
    },
    options: {
        // element: {
        //   line: {
        //     fill: true,
        //   }
        // },
        responsive: true,
        maintainAspectRatio: false,
        // showline: true,
        scales: {
          x: {
              // type: 'linear',
              type: 'time',
              position: 'bottom',
              title: {
                display: true,
                text: 'Date'
              }
          },          
          y: {
            // type: 'linear',
            // type: 'time',
            position: 'bottom',
            title: {
              display: true,
              text: yTitle,
            }
        }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              scaleMode: 'y'
            },
            zoom: {
              // drag: {
              //   enabled:true,
              // },
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'x',
              scaleMode: 'y',
            }
          }
        }
      }
  });
}