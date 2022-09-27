
let chartInfo = document.getElementById("script").getAttribute('chartInfo');
chartInfo = JSON.parse(chartInfo);
console.log(chartInfo);
let channelId = chartInfo[0].channelid;//Wely 8
let api = chartInfo[0].writeapi;
let numpoints = chartInfo[0].numpoints;

let someData = getData(channelId, api, numpoints);

someData.then(response => {
  console.log('returned objec', response);
  makeChart(response.feeds, response.channel.name);
});
async function getData(channelId, api, numpoints){
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
  //change the field names
  let newData = data.map(({
    "created_at": t,
    ...rest
  }) => ({
    t,
    ...rest
  }));

  newData = newData.map(({
    "field1": y,
    ...rest
  }) => ({
    y,
    ...rest
  }));

  console.log(newData);

  var ctx = document.getElementById("Chart").getContext("2d");

  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: name,
        data: newData,
      }]
    },    
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'YYYY MM DD h:mm:ss a'
          },
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Mass (g)'
          }
        }]
      }
    },
  });
}