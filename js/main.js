// D3.js code for creating charts goes here
const year1 = document.getElementById("yearSelect");
const state = document.getElementById("stateSelect");
year1.addEventListener("change",(e)=>{
    pie(state.value,year1.value);
});
state.addEventListener("change",(e)=>{
    pie(state.value,year1.value);
});


function pie(state, year){
d3.csv("data/yearly_categories.csv").then(function (data) {
    pieChart(data ,state,year);

});
}



d3.csv("data/yearly_categories.csv").then(function (data) {
    var grouped = d3.group(data, d => d.Year);
    var yearly = Array.from(grouped, ([key, values]) => ({
        Year: key, 
        TotalEmissions: d3.sum(values, d => +d.TotalEmissions) 
    }));
    pieChart(data, "All", "2018");
    barChart(yearly);
});

d3.csv("data/change.csv").then(function (data) {
    lineChart(data)
});


