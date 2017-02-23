// d3.select(window).on("resize", throttle);

//set the sclae of colours in two different ways
// var cs = chroma.scale('OrRd').colors(6); //OrRd scale designed colours to fit well


var cs = [
  "#f2f0f7",
  "#dadaeb",
  "#bcbddc",
  "#9e9ac8",
  "#807dba",
  "#6a51a3",
  "#4a1486"
]

//var cs = palette;
//var cs = chroma.scale(palette).colors(7); //initial to final value
// var cs = chroma.scale(['white', 'Red']).colors(6);

/*var top_trackers = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "https://privacymeter-eddbf.firebaseio.com/data/global/top_ranks/top_countries_fingerprint.json",
        'dataType': "json",
        'success': function (data) {
            json = data;
            // 'url': "https://privacymeter-eddbf.firebaseio.com/data/global/top_trackers.json",
        }
    });
    return json;
})();*/



/*var zoom = d3.zoom()
    //.extent([1,9])
    .scaleExtent([1, 9])
    .on("zoom", move);
*/
var c = document.getElementById('container2');
var width = c.offsetWidth;
var height = width / 2;


//offsets for tooltips
var offsetL = c.offsetLeft+20;
var offsetT = c.offsetTop+10;

var topo,projection,path,svg,g;

//var graticule = d3.geo.graticule();
var graticule = d3.geoGraticule();

var tooltip = d3.select("#container2").append("div").attr("class", "tooltip hidden");

setup(width,height);

function setup(width,height){
  projection = d3.geoMercator()
    .translate([(width/2), (height/2)])
    .scale( width / 2 / Math.PI);

  path = d3.geoPath().projection(projection);

  svg = d3.select("#container2").append("svg")
      .attr("width", width)
      .attr("height", height)
      //.call(zoom)
      //.on("click", click)
      .append("g");

  g = svg.append("g")
         .on("click", click);

}

d3.json("data/world-topo-min.json", function(error, world) {

  var countries = topojson.feature(world, world.objects.countries).features;

  topo = countries;
  draw(topo);

});

function handleMouseOver(){
  var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
  var ratio = ratio_dict[this.__data__.properties.name] || "Unknown"


  tooltip.classed("hidden", false)
    .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
    .html(this.__data__.properties.name + "\n" + ratio);
}

function handleMouseOut(){
  tooltip.classed("hidden", true);
}


function draw(topo) {

 //map legend creation


  var color_domain = [50, 150, 350, 750, 1500]
  var ext_color_domain = [0, 50, 150, 350, 750, 1500]
  var legend_labels = ["< 1%", "+1%", "+2%", "+3%", "+4%", "> 5"]

  var color = d3.scaleThreshold()
  .domain(color_domain)
  .range(cs)

  var legend = svg.selectAll("g.legend")
  .data(ext_color_domain)
  .enter().append("g")
  .attr("class", "legend");

  var ls_w = 10, ls_h = 20;

  legend.append("rect")
  .attr("x", 20)
  .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function(d, i) { return color(d); })
  .style("opacity", 0.8);

  legend.append("text")
  .attr("x", 40)
  .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
  .text(function(d, i){ return legend_labels[i]; });

  legend.append("text")
    .attr("x", 20)
    .attr("y", 270)
    .attr("style","font-size: 14px; position: absolute;")
    .text("% of visited sites that fingerprint");



  svg.append("path")
     .datum(graticule)
     .attr("class", "graticule")
     .attr("d", path);


  g.append("path")
   .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
   .attr("class", "equator")
   .attr("d", path);


  var country = g.selectAll(".country").data(topo);




test()

function test(){
    $.ajax({
        //'async': false,
        'global': false,
        //'url': "https://privacymeter-eddbf.firebaseio.com/data/global/top_ranks/top_countries_fingerprint.json",
        'url': "https://privacymeter-dtl.firebaseio.com/insights/top_ranks/top_countries_fingerprint.json",
        'dataType': "json",
        'success': function (data) {
	    top_trackers = data;
            country.enter().insert("path")
	      .attr("class", "country")
	      .attr("d", path)
	      .attr("id", function(d,i) { return d.id; })
	      .attr("title", function(d,i) { return d.properties.name; })
	      //.style("fill", function(d, i) { return d.properties.color; })
	      .style("fill", function(d, i) { return countryFill(d.properties.name); })
	      .style("stroke", "#000")
	      .style("stroke-width", "0.4px")
	      .on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);
        }
    });
};

/*
  country.enter().insert("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("id", function(d,i) { return d.id; })
      .attr("title", function(d,i) { return d.properties.name; })
      //.style("fill", function(d, i) { return d.properties.color; })
      .style("fill", function(d, i) { return countryFill(d.properties.name); })
      .style("stroke", "#000")
      .style("stroke-width", "0.4px")
       .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);
*/

  //tooltips capitals
  /*
  d3.select("#container svg path")
    .on("mousemove", function(d,i) {
console.log(d);
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

      tooltip.classed("hidden", false)
             .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
             .html(d.properties.name);

      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true);
      });
*/

  //EXAMPLE: adding some capitals from external CSV file
/*  d3.csv("data/country-capitals.csv", function(err, capitals) {

    capitals.forEach(function(i){
      addpoint(i.CapitalLongitude, i.CapitalLatitude, i.CapitalName );
    });

  });*/

}


function redraw() {
  width = c.offsetWidth;
  height = width / 2;
  d3.select("#container2").select('svg').remove();
  setup(width,height);
  // draw(topo);

}


function move() {

  var t = [d3.event.transform.x,d3.event.transform.y];
  var s = d3.event.transform.k;
  zscale = s;
  var h = height/4;

  t[0] = Math.min(
    (width/height)  * (s - 1),
    Math.max( width * (1 - s), t[0] )
  );

  t[1] = Math.min(
    h * (s - 1) + h * s,
    Math.max(height  * (1 - s) - h * s, t[1])
  );

  //zoom.translateBy(t);
  g.attr("transform", "translate(" + t + ")scale(" + s + ")");

  //adjust the country hover stroke width based on zoom level
  d3.selectAll(".country").style("stroke-width", 0.5 / s);

}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}


//geo translation on mouse click in map
function click() {
  var latlon = projection.invert(d3.mouse(this));
  //console.log(latlon);
}


//function to add points and text to the map (used in plotting capitals)
function addpoint(lon,lat,text) {

  var gpoint = g.append("g").attr("class", "gpoint");
  var x = projection([lon,lat])[0];
  var y = projection([lon,lat])[1];

  gpoint.append("svg:circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("class","point")
        .attr("r", 1.5);

  //conditional in case a point has no associated text
  if(text.length>0){

    gpoint.append("text")
          .attr("x", x+2)
          .attr("y", y+2)
          .attr("class","text")
          .text(text);
  }
}

var ratio_dict = {}

function countryFill(countryName){

  for (var i = 0; i < top_trackers.length; i++){

    var ratio_trackers = parseFloat(top_trackers[i].track_ratio).toFixed(2)

    ratio_dict[top_trackers[i].country] = ratio_trackers + "%";

    if (top_trackers[i].country == countryName){

         if (ratio_trackers == 0){
        return cs[0];

          } else if (ratio_trackers < 1){
        return cs[1];

          } else if (ratio_trackers < 2){
        return cs[2];

          } else if (ratio_trackers < 3){
        return cs[3];

          } else if (ratio_trackers < 4){
        return cs[4];

          } else if (ratio_trackers < 5){
        return cs[5];

          } else if (ratio_trackers >= 5){
        return cs[6];
          }
    }
  }
  return "white";
}
