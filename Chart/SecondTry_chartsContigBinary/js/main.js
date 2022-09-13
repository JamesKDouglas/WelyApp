function genData(name, size){
    let arr = [];
    let digit = 0;
    for(let i=0;i<size;i++){
        digit = Math.round(Math.random());
        arr.push(digit);
    }
    let stringArr = JSON.stringify(arr);

    localStorage.setItem(name, stringArr); //Items in localstorage are strings.
    console.log(`robot makes a dataset named ${name}!`);
    return (`robot makes a dataset!`);
}

function genBalanceChart(binary){
    let yHeight = 0;
    let chartArr = [];
 
    for (let i=0;i<binary.length;i++){
        if(binary[i]==0){
            yHeight--;
        }
        if(binary[i] == 1){
            yHeight++;
        }
        chartArr.push([i,yHeight]);
    }
    return chartArr;
}
let binary = JSON.parse(localStorage.getItem("bigSet").trim());

let chartData = genBalanceChart(binary);

let chartDataX = chartData.map(el => el[0]);
let chartDataY = chartData.map(el => el[1]);


const speedCanvas = document.getElementById("speedChart");

Chart.defaults.font.family = "Teko";
Chart.defaults.font.size = 22;
Chart.defaults.color = "black";

let speedData = {
  labels: chartDataX,
  datasets: [{
    label: "Binary Balance",
    data: chartDataY
  }]
};

let lineChart = new Chart(speedCanvas, {
  type: 'line',
  data: speedData
});