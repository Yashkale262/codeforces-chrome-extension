//<div id="chart"></div>

//chart data
var chartjson = {
  "title": "Students Academic Scores",
  "xval": ["Kerry","Teegan", "Jamalia","Quincy","Darryl","Jescie","Quemby", "Quemby","McKenzie"],
  "yval": [50,14,50,60,70,50,100,50,50],
  "ymax": 150,
  "colors" : ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
}



//constants
var TROW = 'tr',
  TDATA = 'td';

var chart = document.createElement('div');
//create the chart canvas
var barchart = document.createElement('table');
//create the title row
var titlerow = document.createElement(TROW);
//create the title data
var titledata = document.createElement(TDATA);
//make the colspan to number of records
titledata.setAttribute('colspan', chartjson.xval.length );
titledata.setAttribute('class', 'textcenter');
titledata.innerText = chartjson.title;
titlerow.appendChild(titledata);
barchart.appendChild(titlerow);
chart.appendChild(barchart);

//create the bar row
var barrow = document.createElement(TROW);

//lets add data to the chart
for (var i = 0; i < chartjson.xval.length; i++) {
  barrow.setAttribute('class', 'bars');
  var prefix = chartjson.prefix || '';
  //create the bar data
  var bardata = document.createElement(TDATA);
  var barvalue = document.createElement('div');
  var bar = document.createElement('div');
  var legend= document.createElement('div');

  bar.setAttribute('class', chartjson.colors[i]);
  bardata.setAttribute('class', 'textcenter');
  barvalue.setAttribute('class', 'textcenter');
  bar.style.height = chartjson.yval[i]/chartjson.ymax*100 + '%';
  barvalue.innerText = chartjson.yval[i];
  legend.innerText = chartjson.xval[i] ;

  bardata.appendChild(barvalue);
  bardata.appendChild(bar);
  bardata.appendChild(legend);
  barrow.appendChild(bardata);

}


barchart.appendChild(barrow);
chart.appendChild(barchart);
document.getElementById('chart').innerHTML = chart.outerHTML;
