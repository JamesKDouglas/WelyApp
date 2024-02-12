var slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [20, 80],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});

// Get the bearer key using an API key.
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
  // I should load these values from some kind of double slider.
  let start = new Date('2024-02-07');
  let stop = new Date('2024-02-12');
  getData(bearerKey, start, stop);
})
.catch(error => console.log('error', error));

async function getData(bearerKey, start, stop = new Date(Date.now())){
  
  // set a default start time if none is specified
  if (!start){
    start = new Date()
    start.setDate(stop.getDate() - 7)
  }
  

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  myHeaders.append("Access-Control-Request-Headers", "*");
  myHeaders.append("Authorization", `Bearer ${bearerKey}`)

  var raw = JSON.stringify({
      "collection":"TimeSeries.Gray1",
      "database":"Cluster0",
      "dataSource":"Cluster0",
      "sort": {"time": -1},
      "filter": {
        "time": {
          "$gte": { "$date": start },
          "$lt": { "$date": stop }
        }
      },
      "limit": 1000
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
        console.log("Got a result from MongoDB");
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

        let dataForReg = [];

        for (let i=0;i<temperature.length;i++){
          dataForReg.push([temperature[i], massADC[i]])
        }

        console.log(dataForReg);
        const resultReg = regression.linear(dataForReg);
        const gradient = resultReg.equation[0];
        const yIntercept = resultReg.equation[1];

        console.log("linear regression:", "yInt:", yIntercept, "slope:", gradient);
        console.log("rest of the linear regression:", resultReg);  
        
        
        let massADCCal = [];
        for (let i=0;i<temperature.length;i++){
          massADCCal.push(massADC[i] - gradient*temperature[i] - yIntercept);
        }
        //data array has to follow the form data = [{x:"timestamp", y:"value"}]
        let point;
        let dataWithCal = [];
        for (let i=0;i<temperature.length; i++){
          point = {'x':`${timeStamp[i]}`, 'y': `${massADCCal[i]}`};
          dataWithCal.push(point);
        }
        console.log("time to make an awesome chart")
        makeChart(dataWithCal, "My awesome chart");
      })
      .catch(error => console.log('error', error));
}

function makeChart(data, name){
 let dataArr = data;
 let yTitle = "Mass (g)";
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
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
              type: 'time',
              position: 'bottom',
              title: {
                display: true,
                text: 'Date'
              }
          },          
          y: {
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