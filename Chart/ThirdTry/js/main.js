async function getData(channelId, api){
  //some sort of fetch try catch block?
  // api ref https://www.mathworks.com/help/thingspeak/readdata.html

  //default format
  //default #results
  //url: https://api.thingspeak.com/channels/<channel_id>/feeds.<format>
  //send a GET request 
  //append query string params:api_key, # results
  // ex https://api.thingspeak.com/channels/9/feeds.json?results=3
  let format = "json";
  let numResults = 500;
  let dataURL = "https://api.thingspeak.com/channels/" + channelId + "/feeds." + format + "?results=" + numResults;
  console.log(dataURL);

  try{
    const res = await fetch(dataURL)
    const data = await res.json();
    console.log(data);
    return data;
  }
  catch{
    throw new Error("uh Oh!")
  }
  
}

let channelId = "637544";//Wely 8
let api = "J4BE2F0E2OGQAFOG";

let someData = getData(channelId, api);

let someExampleData = [{"created_at":"2022-09-09T00:21:24Z","entry_id":117970,"field1":"910.193420","field2":"913.247437","field3":"25.127039"},{"created_at":"2022-09-09T00:31:26Z","entry_id":117971,"field1":"910.292480","field2":"913.352966","field3":"25.131433"},{"created_at":"2022-09-09T00:41:28Z","entry_id":117972,"field1":"909.858521","field2":"912.954834","field3":"25.166651"},{"created_at":"2022-09-09T00:51:30Z","entry_id":117973,"field1":"909.816040","field2":"912.922119","field3":"25.215052"},{"created_at":"2022-09-09T01:01:32Z","entry_id":117974,"field1":"909.599060","field2":"912.714966","field3":"25.223871"}]
// function genBalanceChart(binary){
//     let yHeight = 0;
//     let chartArr = [];
 
//     for (let i=0;i<binary.length;i++){
//         if(binary[i]==0){
//             yHeight--;
//         }
//         if(binary[i] == 1){
//             yHeight++;
//         }
//         chartArr.push([i,yHeight]);
//     }
//     return chartArr;
// }
// let binary = JSON.parse(localStorage.getItem("bigSet").trim());

// let chartData = genBalanceChart(binary);

// let chartDataX = chartData.map(el => el[0]);
// let chartDataY = chartData.map(el => el[1]);

let chartDataX = someExampleData.map(el => el.created_at);
let chartDataY = someExampleData.map(el => el.field1);

const speedCanvas = document.getElementById("speedChart");

Chart.defaults.font.family = "Teko";
Chart.defaults.font.size = 22;
Chart.defaults.color = "black";

let speedData = {
  labels: chartDataX,
  datasets: [{
    label: "Wely 8, some points",
    data: chartDataY
  }]
};

let lineChart = new Chart(speedCanvas, {
  type: 'line',
  data: speedData
});