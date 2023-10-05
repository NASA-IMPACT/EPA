// D3.js code for creating charts goes here
const year = document.getElementById("yearSelect");
const state = document.getElementById("stateSelect");
const title = document.getElementById("titleSelect");
year.addEventListener("change",(e)=>{
    pie(state.value,year.value);
    putLayer(year.value, title.value);
});
state.addEventListener("change",(e)=>{
    pie(state.value,year.value);
    d3.csv("data/statewiseYearlyTotal.csv").then(function (data){
        data = data.filter(d => d.State == state.value);
        barChart(data,state.value);
    
    });
    d3.csv("data/change.csv").then(function (data) {
        data = data.filter(d => d.State === state.value);
        lineChart(data,state.value,title.value)
    });
});

title.addEventListener("change",(e)=>{
    
    d3.csv("data/change.csv").then(function (data) {
        data = data.filter(d => d.State === state.value);
        lineChart(data,state.value, title.value);
        
    });
    putLayer(year.value, title.value);
});

// year.addEventListener("change",(e)=>{
//     putLayer(year.value, title.value);
// });

function pie(state, year){
d3.csv("data/yearly_categories.csv").then(function (data) {
    pieChart(data ,state,year);
    data = data.filter(d => d.State == state.value);
});
}

// For initial plot rendering 
d3.csv("data/yearly_categories.csv").then(function (data) {
    var grouped = d3.group(data, d => d.Year);
    var yearly = Array.from(grouped, ([key, values]) => ({
        Year: key, 
        TotalEmissions: d3.sum(values, d => +d.TotalEmissions) 
    }));
    pieChart(data, "All", "2020");
});

d3.csv("data/statewiseYearlyTotal.csv").then(function (data){
    const filteredData = data.filter(d => d.State ==="All");
    barChart(filteredData,"All");

});

d3.csv("data/change.csv").then(function (data) {
    data = data.filter(d => d.State === "All");
    lineChart(data,"All","Total Methane (annual)");
});



