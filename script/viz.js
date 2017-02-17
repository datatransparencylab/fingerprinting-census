// Visualization 1 -- Global Overview
var globalData, total_sites,fingerprint_sites, categoryTraffic; // a global


  d3.json("https://privacymeter-eddbf.firebaseio.com/data/global.json", function(json) {
  globalData = json;


var totalFingerprinted= globalData.fingerprint_traffic;
// totalFingerprinted=   ;
    var totalAnalyzed = globalData.websites;
    totalAnalyzed= d3.format(",")(totalAnalyzed);
     totalFingerprinted = d3.format(",")(totalFingerprinted);

     var lastUpdated= globalData.last_update;

     // Introduction div data
//$('#introNumber').append( "We have audited over " + "<span>" + totalAnalyzed + "</span>"+ " of the most visited websites to shine a light on the practice of fingerprinting. Here are our some of our results. "  );
$('#introNumber').append( "We have audited over " + "<span>400,000</span>"+ " of the most visited websites to shine a light on the practice of fingerprinting. Here are our some of our results. "  );
$('#updated').append( "Last updated: " + lastUpdated);


$('#totalFingerprinted').append( "<strong>" + totalFingerprinted + " "+ "</strong>" + "<p>visits have been fingerprinted in the last month.</p>"  );


// draw global data doughnut viz
visualizeDataT();

drawDoughnuts("categories","business","#category1");
drawDoughnuts("categories","news","#category2");
drawDoughnuts("categories","health","#category3");
drawDoughnuts("categories","kids_and_teens","#category4");
drawDoughnuts("categories","computers","#category5");
drawDoughnuts("categories","shopping","#category6");
drawDoughnuts("categories","arts","#category7");
drawDoughnuts("categories","home","#category8");


});

loadTable();

function loadTable(){
// Load Table data
$.getJSON("https://privacymeter-eddbf.firebaseio.com/data/global/top_ranks/top_countries_fingerprint.json", function(data){
           $("#container").html="";
           $("#container").append("<tr><th>Country</th><th>Ratio</th></tr>");
           if(data != null && $.isArray(data)){
               data.sort(function(a,b){
                 return (b.track_ratio-a.track_ratio);
               });
               var top = data.slice(0,10);
               $.each(top, function(index, value){

                   $("#container").append("<tr><td>" + value.country + "</td><td class='second-colum'>" + value.track_ratio + "</td></tr>");
               });
           }
        });



}



function visualizeDataT(){

 total_sites =globalData.websites;
 fingerprint_sites = globalData.websites_tracking;

// console.log("FP Sites===" + total_sites);
// console.log("FP Sites===" + fingerprint_sites);
// console.log("PERCENTAGE of sites that fingerprint ===" + "    "+ fingerprint_sites/total_sites);
var fpPercent=fingerprint_sites/total_sites*100;
//limit the float width, number of decimals
fpPercent= d3.format(".3g")(fpPercent);
var noFpPercent= 100-fpPercent;
// console.log("formatted =="+fpPercent);



// PERCENTAGE OF NEWS SITES DOUGHNUT
// thevariable data is defined as an argument in the callback function of d3 json
// d3.json("mydata.json", function(data) {
    var data=[fpPercent,noFpPercent];

    var r=170;
    var color= d3.scaleOrdinal()
                  .range([d3.rgb(111, 37, 127), "#eeeeee"]);
var maxD= d3.max(data);
var minD= d3.min(data);


    var canvas= d3.select("#globalVisitors").append("svg")
          .attr("width", 500)
          .attr("height",500);

    var group= canvas.append("g")
                    .attr("transform", "translate(300,200)");


// creat an arc path generator. the path function will fetch info from here.
    var arc= d3.arc()
              .innerRadius(110)
              .outerRadius(r)


var pie= d3.pie()
          .value(function (d){ return d; });


// fetch data, then pass it through the Pie Layout "var pie"
var arcs = group.selectAll(".arc")
                .data(pie(data))
                .enter()
                  .append("g")
                  .attr("class","arc")



           group.append("text")
                .attr("text-anchor","middle")
                .attr("class","dataHighlight")
                .attr("transform", arc.centroid(minD))
                .text(function(d) { return d3.min(data)+"%";});
// necesitaras enter() method para texto dinamico viniendo de db
          // append paths

          arcs.append("path")
            .attr("d", arc)
            .attr("fill", function(d) { return color(d.data);})

}


//Fingerprinted Traffic by Website Category
function drawBargraph() {



    var svgCat = d3.select("#categoryBars svg"),
        margin = {top: 20, right: 50, bottom: 30, left: 150},
        width = +svgCat.attr("width") - margin.left - margin.right,
        height = +svgCat.attr("height") - margin.top - margin.bottom;

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
      // map the domain data to the view div width
    var x = d3.scaleLinear()
              .range([0, width]);
              // map to the view div height
    var y = d3.scaleBand()
              .range([height, 0]);

    var gr = svgCat.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// URL FOR CATEGORIES: https://privacymeter-eddbf.firebaseio.com/data/global/categories.json


//

// console.log(data2);
//     });
// d3.json("horizontalData.json", function(error, data1) {

d3.json("https://privacymeter-eddbf.firebaseio.com/data/global/top_ranks/top_categories_traffic.json", function(error,data1){

          // var keyArray=d3.keys(data1);

          // console.log(keyArray[0]);
// console.log(data1);
//For loop que busque data1[i]


// console.log("bargraph a trafficValue =" + "  "+ trafficValue);
// data1[query][target].tracking_traffic;


        if (error) throw error;
      // sort data from max to min:
          data1.sort(function(a, b) { return a.value - b.value; });

      //add the domain data
        x.domain([0, d3.max(data1, function(d) { return d.value; })]);
        y.domain(data1.map(function(d) { return d.collection; }))
          .padding(0.1);

//Append AXES to svg group
//d3.axis generates the visual elements, it's a 'draw function', are meant to be used with quantitative scales.
//At a minimum, each axis also needs to be told on what scale to operate. Here, x is the scaleLinear
        gr.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(3)
              .tickFormat(function(d) {
              //Add commas to billions
              return d= d3.format(",")(d);

              // return d3.format('d');
              // return



               }).tickSizeInner([-height]));





        gr.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));

//APPEND RECTANGLES BOUND TO DATA. Use .enter because data willl be updated
        gr.selectAll(".bar")
            .data(data1)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("y", function(d) { return y(d.collection); })
            .attr("width", function(d) { return x(d.value); })
            .on("mousemove", function(d){
          // Replace hard coded vals (50, 90) with 50% of the tooltip wioth and height + a top buffer
                tooltip
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 90 + "px")
                  .style("display", "inline-block")
                  .html((d.collection) + "<br><span>" + (d3.format(",")(d.value)) + "   "+ "tracked visits" + "</span>");
            })
            .on("mouseout", function(d){ tooltip.style("display", "none");})


            // gr.append("text")
            //   .text("TEXTTT");
    });
}
//Fingerprinted Traffic by Website Category
drawBargraph();

// PERCENTAGE OF NEWS SITES DOUGHNUT
function drawDoughnuts(query,target,catDiv){
// PERCENTAGE OF NEWS SITES DOUGHNUT

//  d3.json("https://privacymeter-eddbf.firebaseio.com/data/global/top_ranks/top_categories_traffic.json", function(error,data2){


// console.log(data2[0]);
//  });


// 1- get # of total news analyzed
var total= globalData[query][target].websites;
// 2- get # of fingerprint news sites
var tracking= globalData[query][target].websites_tracking;

var traffic= globalData[query][target].tracking_traffic;

traffic= d3.format(",")(traffic);


// 3- convert to PERCENTAGE
var perc= tracking/total *100;
perc= d3.format(".3g")(perc);
var balance= 100-perc;


var colorMap = {
 arts:d3.rgb(204,0,190),
 health:d3.rgb(0, 190, 204),
 business: d3.rgb(0, 204, 14),
 news:d3.rgb(116, 0, 204) ,
 computers:d3.rgb(18,152,241)  ,
 shopping:d3.rgb(0,204,116)  ,
 home: d3.rgb(116,255,0) ,
 kids_and_teens: d3.rgb(204, 0, 88)
};

// var color= d3.rgb(204, 0, 88);
var color= colorMap[target];


var iconMap={

  arts:"images/icons/film-strip-with-two-photograms.svg"  ,
 health:"images/icons/medical-kit.svg" ,
 business: "images/icons/briefcase.svg" ,
 news:"images/icons/newspaper.svg"   ,
 computers: "images/icons/open-laptop-computer.svg"  ,
 shopping:"images/icons/shopping-cart-black-shape.svg"   ,
 home:"images/icons/home.svg"   ,
 kids_and_teens:  "images/icons/smile.svg"
}
var icon= iconMap[target];



    var data=[perc, balance];
    var r=100;
    var color= d3.scaleOrdinal()
                  .range([color, "#eeeeee"]);
var maxD= d3.max(data);
var minD= d3.min(data);

var catDiv;

    var canvas= d3.select(catDiv).append("svg")
          .attr("width", 300)
          .attr("height", 300);

           d3.select(catDiv)
              .append("div")
              .attr("class", "doughnutLabel")
              // .html("<br><span>" + perc + "%" + "</span>" +"  of " + target + "  sites are fingerprinting.");
              .html("<span>" + perc + "%" + "</span>" +"  of " + target + "  sites are fingerprinting." +  "<br><span>"+ traffic+ "</span>" + "  "+ " visits to " + target +  " sites were fingerprinted in a month.");
// " amounting to " +
                   // .text("Website Category:" + "  "+ target);

    var group= canvas.append("g")
                    .attr("transform", "translate(150,140)");

// creat an arc path generator. the path function will fetch info from here.
    var arc= d3.arc()
              .innerRadius(60)
              .outerRadius(r);

var pie= d3.pie()
          .value(function (d){ return d; });


// fetch data, then pass it through the Pie Layout "var pie"
var arcs = group.selectAll(".arc")
                .data(pie(data))
                .enter()
                  .append("g")
                  .attr("class","arc");


            // group.append("image")
            //     .attr("xlink:href", "url"):
         group.append("svg:image")
                .attr("xlink:href", icon)
                .attr("text-anchor","middle")
                .transition().duration(4000)
                .style("opacity",.5)
                .attr("width", 50)
                .attr("height", 50)
                .attr("x", -25)
                .attr("y",-25);



           // group.append("text")
           //      .attr("text-anchor","middle")
           //      .attr("class","doughnutText")
           //      .attr("transform", arc.centroid(minD))
           //      .text(function(d) { return d3.min(data) + "%" ;});
// necesitaras enter() method para texto dinamico viniendo de db
          // append paths

          arcs.append("path")
            .attr("d", arc)
            .attr("fill", function(d) { return color(d.data);});

            // group.append("text")
            //           .attr("text-anchor","middle")
            //            .attr("transform", "translate(-200,-50)")
            //             .text("News"+ "   "+ "Websites");


// text on arcs
            // arcs.append("text")
            //     .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")";})
            //     .attr("text-anchor","middle")
            //     .attr("font-size","24px")
            //     .attr("fill", "white")
            //     .text(function(d) { return d.data + " %"  ;});

 }

// div id=trendTypes
    //begin Trends by Type


$('input[name=range]:radio').change(function () {
  update(dataset, periods, $('input[name=range]:checked').val())
});


function drawTrendsGraph(dataset, divId){
  var margin = {top: (parseInt(d3.select(divId).style('width'), 10)/10), right: (parseInt(d3.select(divId).style('width'), 10)/20), bottom: (parseInt(d3.select(divId).style('width'), 10)/5), left: (parseInt(d3.select(divId).style('width'), 10)/20)},
      width = parseInt(d3.select(divId).style('width'), 10) - margin.left - margin.right,
      height = parseInt(d3.select(divId).style('height'), 10) - margin.top - margin.bottom;

  var x0 = d3.scaleBand()
      .range([0, width])
      .padding(.1);

  //var x1 = d3.scaleOrdinal();
  var x1 = d3.scaleBand();
  var y = d3.scaleLinear()
      .range([height, 0]);

  var colorRange = d3.scaleOrdinal(d3.schemeCategory20);
  var color = d3.scaleOrdinal()
      .range(colorRange.range());

  //var xAxis = d3.svg.axis()
  var xAxis = d3.axisBottom()
      .scale(x0);
      //.orient("bottom");

  //var yAxis = d3.svg.axis()
  var yAxis = d3.axisLeft()
      .scale(y)
      //.orient("left")
      .tickFormat(d3.format(".2s"));
      //.tickFormat(d3.format(",.2r"));

  var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

  console.log(divId)
  var svg = d3.select(divId).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /*dataset = [
      {label:"Dec'16", "Canvas":20, "Font":170, "WebRTC": 50, "Audio":20},
      {label:"Jan'17", "Canvas":20, "Font":170, "WebRTC": 50, "Audio":20},
      {label:"Feb'17", "Canvas":20, "Font":170, "WebRTC": 50, "Audio":20}
  ];*/


  //to do after the data set is full
  var options = d3.keys(dataset[0]).filter(function(key) { return key !== "label"; });

  dataset.forEach(function(d) {
      d.valores = options.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(dataset.map(function(d) { return d.label; }));
  //x1.domain(options).rangeRoundBands([0, x0.rangeBand()]);
  x1.domain(options)
    .rangeRound([0, x0.bandwidth()]);

  y.domain([0, d3.max(dataset, function(d) { return d3.max(d.valores, function(d) { return d.value; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", -20)
      .attr("x",500)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Title of the Graph");

  var bar = svg.selectAll(".bar")
      .data(dataset)
      .enter().append("g")
      .attr("class", "rect")
      .attr("transform", function(d) { return "translate(" + x0(d.label) + ",0)"; });

  bar.selectAll("rect")
      .data(function(d) { return d.valores; })
      .enter().append("rect")
      //.attr("width", x1.rangeBand())
      .attr("width", x1.bandwidth())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("value", function(d){return d.name;})
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  bar
      .on("mousemove", function(d){
    divTooltip.style("left", d3.event.pageX+10+"px");
    divTooltip.style("top", d3.event.pageY-25+"px");
    divTooltip.style("display", "inline-block");
    var x = d3.event.pageX, y = d3.event.pageY
    var elements = document.querySelectorAll(':hover');
    l = elements.length
    l = l-1
    elementData = elements[l].__data__

    switch(elementData.name) {
    case "Traffic":
        divTooltip.html((d.label)+"<br>"+elementData.name+"<br>"+elementData.value + " visits");
        break;
    case "Fingerprints":
        divTooltip.html((d.label)+"<br>"+elementData.value + "<br>" + elementData.name);
        break;
    default:
        divTooltip.html((d.label)+"<br>"+elementData.name+"<br>"+elementData.value + " sites");
    }});
  bar
      .on("mouseout", function(d){
    divTooltip.style("display", "none");
      });


  var legend = svg.selectAll(".legend")
      .data(options.slice())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("y", -30)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", -22)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
}

function createLabels(key) {

  var monthDic = {
    "01":"Jan",
    "02":"Feb",
    "03":"Mar",
    "04":"Apr",
    "05":"May",
    "06":"Jun",
    "07":"Jul",
    "08":"Aug",
    "09":"Sep",
    "10":"Oct",
    "11":"Nov",
    "12":"Dec"
  };

  year = key.substring(0,4);
  month = key.substring(4,6);
  label = monthDic[month] + "'" + year.substring(2,4);
  return label
}

function fpTypesJSON(data, period, top) {
  var fpJson = '{ "label":"' + createLabels(period) + '" , "Canvas":"'+ data[period][top]["fingerprint"]["canvas"] +'" , "Font":"'+ data[period][top]["fingerprint"]["font"] +'", "WebRTC":"'+ data[period][top]["fingerprint"]["webrtc"] +'", "Audio":"'+ data[period][top]["fingerprint"]["audio"] +'" }';
  return JSON.parse(fpJson)
}

function fpTrafficJSON(data, period, top) {
  var fpJson = '{ "label":"' + createLabels(period) + '" , "Traffic":"'+ data[period][top]["traffic"] + '" }';
  return JSON.parse(fpJson)
}

/*function fpTypesJSON(data, period, top) {
  var fpJson = '{ "label":"' + createLabels(period) + '" , "Canvas":"'+ data[period][top]["fingerprint"]["canvas"] +'" , "Font":"'+ data[period][top]["fingerprint"]["font"] +'", "WebRTC":"'+ data[period][top]["fingerprint"]["webrtc"] +'", "Audio":"'+ data[period][top]["fingerprint"]["audio"] +'" }';
  return JSON.parse(fpJson)
}*/

function fpTotalJSON(data, period, top) {
  var fpJson = '{ "label":"' + createLabels(period) + '" , "Fingerprints":"'+ data[period][top]["fingerprint"]["total"] + '" }';
  return JSON.parse(fpJson)
}

function update(dataset, periods, range) {
    // console.log("ENTRA")

    /*dataset = [
        {label:"Dec'16", "Canvas":22},
        {label:"Jan'17", "Canvas":25},
        {label:"Feb'17", "Canvas":27},
        {label:"Dec'18", "Canvas":20},
        {label:"Jan'18", "Canvas":18},
        {label:"Feb'18", "Canvas":25},
        {label:"Dec'19", "Canvas":22},
        {label:"Jan'19", "Canvas":25},
        {label:"Feb'19", "Canvas":27},
        {label:"Dec'20", "Canvas":20},
        {label:"Jan'20", "Canvas":18},
        {label:"Feb'20", "Canvas":25},
        {label:"Dec'29", "Canvas":22},
        {label:"Jan'29", "Canvas":25},
        {label:"Feb'29", "Canvas":27},
        {label:"Dec'30", "Canvas":20},
        {label:"Jan'30", "Canvas":18},
        {label:"Feb'30", "Canvas":25}
    ]*/


    divId = "#trendTraffic"

    var svg = d3.select(divId + " svg");
    svg.remove();

    datasetArray = [];
    for (i = 0; i < periods.length; ++i) {
      datasetArray.push(fpTrafficJSON(dataset, periods[i], range))
    }
    drawTrendsGraph(datasetArray, divId);
    divId = "#trendTotal"
    var svg = d3.select(divId + " svg");
    svg.remove();

    datasetArray = [];
    for (i = 0; i < periods.length; ++i) {
      datasetArray.push(fpTotalJSON(dataset, periods[i], range))
    }
    drawTrendsGraph(datasetArray, divId, svg);

    divId = "#trendTypes"
    var svg = d3.select(divId + " svg");
    svg.remove();

    datasetArray = [];
    for (i = 0; i < periods.length; ++i) {
      datasetArray.push(fpTypesJSON(dataset, periods[i], range))
    }
    drawTrendsGraph(datasetArray, divId);

}

var dataset;
var periods;

$.getJSON('https://privacymeter-dtl.firebaseio.com/trends.json', function(dataFB) {
  //dataset = [];
  dataset = dataFB;
  periods = Object.keys(dataFB).sort();

  /*for (i = 0; i < periods.length; ++i) {
    dataset.push(fpTypesJSON(dataFB, periods[i], "100000"))
  }*/

  update(dataset, periods, $('input[name=range]:checked').val())
});
