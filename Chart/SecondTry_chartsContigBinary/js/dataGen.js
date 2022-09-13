

export function genData(name, size){
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