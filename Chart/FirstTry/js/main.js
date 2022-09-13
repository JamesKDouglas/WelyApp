// parameters: 
// return:
// example:
// pseudocode:
let data = localStorage.getItem("smallSet");
data = JSON.parse(data.trim());

let data2 = localStorage.getItem("smallSet2");
data2 = JSON.parse(data2.trim());



let yHeight = 0;
let chartArr = [];
let chartArr2 = [];
     //make the xy chart

for (let i=0;i<data.length;i++){
    if(data[i]==0){
        yHeight--;
    }
    if(data[i] == 1){
        yHeight++;
    }
    chartArr.push([i,yHeight]);
}

yHeight = 0;
for (let i=0;i<data2.length;i++){
    if(data2[i]==0){
        yHeight--;
    }
    if(data2[i] == 1){
        yHeight++;
    }
    chartArr2.push([i,yHeight]);
}

const ctx = document.getElementById('myChart').getContext('2d');

const config = {
	type: 'line',
	data: {
		labels: Object.keys(chartArr),
		datasets: [
			{
				label: 'BinaryArray',
				data: Object.values(chartArr),
            },
            {
				label: 'BinaryArray2',
				data: Object.values(chartArr2),
			},
		],
    },
    options: {
        indexAxis: 'x',
        backgroundColor: [
            'rgba(255, 50, 0, 1)',
          ],
          maintainAspectRatio: false,
          responsive: false
    }
};

const myChart = new Chart(ctx, config);

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