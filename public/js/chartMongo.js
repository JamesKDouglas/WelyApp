// import { BarWithErrorBarsController, BarWithErrorBar } from 'chartjs-chart-error-bars';
// const {BarWithErrorBarsController} = require('chartjs-chart-error-bars');
let chartInfo = document.getElementById("script").getAttribute('chartInfo');
chartInfo = JSON.parse(chartInfo);
console.log("chartInfo:", chartInfo);

// let channelId = chartInfo[0].channelid;//Wely 8
// let api = chartInfo[0].writeapi;
// let numpoints = chartInfo[0].numpoints;
// let field = chartInfo[0].field;

let someData = getData(channelId, api, numpoints, field);

someData.then(response => {
  console.log('returned object', response);
  makeChart(response.feeds, response.channel.name);
});

async function getData(channelId, api, numpoints, field){
  // api ref https://www.mathworks.com/help/thingspeak/readdata.html
  //default format
  //default #results
  //url: https://api.thingspeak.com/channels/<channel_id>/feeds.<format>
  //append query string params:api_key, # results
  // ex https://api.thingspeak.com/channels/9/feeds.json?results=3
  let format = "json";
  let numResults = numpoints;
  let dataURL = "https://api.thingspeak.com/channels/" + channelId + "/feeds." + format + "?results=" + numResults + "?api_key=" + api;
  console.log(dataURL);
  console.log("field:", field);
  if (field === "mass"){
    console.log("mass selected!");
    localStorage.setItem("field", "field1");
  } else if (field === "temperature"){
    console.log("temperature selected!");
    localStorage.setItem("field", "field3")
  }
  try{
    const res = await fetch(dataURL)
    const data = await res.json();
    return data;
  }
  catch{
    throw new Error("uh Oh!")
  } 
  
}

function makeChart(data, name){

  // let dataType = document.getElementsByName('data_type');
  // console.log("data type selected to chart:", dataType);

  //change the field names

  let field = localStorage.getItem("field");
  console.log("retrieved fieldname:", field);
  let newData = {};

  //One way to show temperature data is to tweak this.
  //I feel like I could do this in a more direct fashion without the if statements,
  //but I notice I can't just use the variable directly inside the curly brackets  must be a scope issue.
  let yTitle = "Mass (g)";
  if (field === "field3"){
    //field 3 is temperature
    newData = data.map(({"created_at": x, "field3": y}) => ({
      x,  y,
    }));
    yTitle = "Temperature (deg C)";
  } else {
    //field 1 is mass
    newData = data.map(({"created_at": x, "field1": y}) => ({
      x,  y,
    }));
    
  }

  console.log(newData);

  let dataArr = [];
  newData.forEach((el) => dataArr.push({"x":el.x,"y": Number(el.y), "yMax":Number(el.y)+2, "yMin":Number(el.y)-2}));

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