//modifypage function is called as soon as page is loaded.
window.addEventListener('load',modifypage);


//Function returns the handle name
function getProfile()
{
  var profile=window.location.pathname.toString();
  profile=profile.slice(9);
  return profile;
}

//Function returns the title/color corresponding to a given rating
function getColor(rating)
{
  if(rating<1200)return "newbie";
  if(rating<1400)return "pupil";
  if(rating<1600)return "specialist";
  if(rating<1900)return "expert";
  if(rating<2100)return "cm";
  if(rating<2300)return "master";
  if(rating<2400)return "int_master";
  if(rating<2600)return "grandmaster";
  if(rating<3000)return "int_grandmaster";
  if(rating>=3000)return "legend_grandmaster";
}

function User(profile) {
  this.profile=profile;

  //Stores number of problems solved in each rating category
  this.problemData={
    all:{800:0,900:0,1000:0,1100:0,1200:0,1300:0,1400:0,1500:0,1600:0,1700:0,1800:0,1900:0,2000:0,2100:0,2200:0,2300:0,2400:0,2500:0,2600:0,2700:0,2800:0,2900:0,3000:0,3100:0,3200:0,3300:0,3400:0,3500:0},
    contest:{800:0,900:0,1000:0,1100:0,1200:0,1300:0,1400:0,1500:0,1600:0,1700:0,1800:0,1900:0,2000:0,2100:0,2200:0,2300:0,2400:0,2500:0,2600:0,2700:0,2800:0,2900:0,3000:0,3100:0,3200:0,3300:0,3400:0,3500:0},
    practice:{800:0,900:0,1000:0,1100:0,1200:0,1300:0,1400:0,1500:0,1600:0,1700:0,1800:0,1900:0,2000:0,2100:0,2200:0,2300:0,2400:0,2500:0,2600:0,2700:0,2800:0,2900:0,3000:0,3100:0,3200:0,3300:0,3400:0,3500:0},
    virtual:{800:0,900:0,1000:0,1100:0,1200:0,1300:0,1400:0,1500:0,1600:0,1700:0,1800:0,1900:0,2000:0,2100:0,2200:0,2300:0,2400:0,2500:0,2600:0,2700:0,2800:0,2900:0,3000:0,3100:0,3200:0,3300:0,3400:0,3500:0},
    problemByTopic:{},
  }

  this.submissions=0;

//Function to fetch problem data from api
  this.getProblemData=async function(){
  let isEmpty=1;
  do{
    isEmpty=1;
    let url="https://codeforces.com/api/user.status?handle="+this.profile+"&from="+(this.submissions+1)+"&count="+(this.submissions+1000);
    const response = await fetch(url);
    const jsonData = await response.json();
    jsonData.result.forEach((prb)=>
    {
      isEmpty=0;
      this.submissions++;
      var rating=prb.problem.rating;
      if(prb.verdict=="OK"){
        this.problemData.all[rating]++;
        if(prb.author.participantType=="CONTESTANT")this.problemData.contest[rating]++;
        if(prb.author.participantType=="VIRTUAL")this.problemData.virtual[rating]++;
        if(prb.author.participantType=="CONTESTANT")this.problemData.virtual[rating]++;
        if(prb.author.participantType=="PRACTICE")this.problemData.practice[rating]++;
      }
    });
  }while(isEmpty==0);

  return this.problemData;
};

//Function to display Bar graph
  this.displayBarGraph=async function(typ){
    var chartjson = {
      "title": "Distribution of problems solved by rating",
      "xval": [],
      "yval": [],
      "ymax": 0,
      "colors" : []
    }

    for(var rating=800;rating<=3500;rating+=100)
    {
      if(this.problemData[typ][rating]>0)
      {
        chartjson.xval.push(rating);
        chartjson.yval.push(this.problemData[typ][rating]);
        chartjson.colors.push(getColor(rating));
        if(chartjson.ymax<this.problemData[typ][rating])
        {
          chartjson.ymax=this.problemData[typ][rating];
        }
      }
    }
    console.log(chartjson);
    var TROW = 'tr',
      TDATA = 'td';

    var chart = document.createElement('div');//create the chart canvas
    var barchart = document.createElement('table');  //create the title row
    var titlerow = document.createElement(TROW);//create the title data
    var titledata = document.createElement(TDATA);//make the colspan to number of records

    titledata.setAttribute('colspan', chartjson.xval.length );
    titledata.setAttribute('class', 'textcenter');
    titlerow.setAttribute('class' ,'titlerow');
    barchart.setAttribute('class', 'rating_table');
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
      //create the bar data. Bar Data contains barvalue, bar and xlabel
      var bardata = document.createElement(TDATA);
      var barvalue = document.createElement('div');
      var bar = document.createElement('div');
      var xlabel= document.createElement('div');

      bar.setAttribute('class', chartjson.colors[i]);
      bardata.setAttribute('class', 'textcenter');
      const col_width=100/chartjson.xval.length;
      bardata.setAttribute('style', 'width:'+col_width+'%; padding:'+col_width/10+'%');
      barvalue.setAttribute('class', 'textcenter');
      bar.style.height = chartjson.yval[i]/chartjson.ymax*90 + '%';
      barvalue.innerText = chartjson.yval[i];


      if(chartjson.xval.length>=20)
      {
        xlabel.setAttribute('style','display:flex');
        xlabel.innerHTML = '<span class="slanting">'+chartjson.xval[i]+'</span>' ;
      }
      else{
        xlabel.innerHTML = '<span>'+chartjson.xval[i]+'</span>' ;
      }

      bardata.appendChild(barvalue);
      bardata.appendChild(bar);
      bardata.appendChild(xlabel);
      barrow.appendChild(bardata);
    }
    barchart.appendChild(barrow);
    chart.appendChild(barchart);
    if(document.getElementById('ratingChart').children.length>1)
    {
      document.getElementById('ratingChart').removeChild(document.getElementById('ratingChart').children[1]);
    }
    console.log(document.getElementById('ratingChart').children);
    document.getElementById('ratingChart').appendChild(chart);

  }

}

//Function to add select boxes(to select all,rated,practice questions) in div 1 
function addSelect()
{
  var selectBox=document.createElement("select");
  var opt1=document.createElement("option");
  opt1.value="all";
  opt1.innerHTML="All";
  var opt2=document.createElement("option");
  opt2.value="contest";
  opt2.innerHTML="Rated Contests";
  var opt3=document.createElement("option");
  opt3.value="virtual";
  opt3.innerHTML="All Contests";
  var opt4=document.createElement("option");
  opt4.value="practice";
  opt4.innerHTML="Practice";
  selectBox.appendChild(opt1);
  selectBox.appendChild(opt2);
  selectBox.appendChild(opt3);
  selectBox.appendChild(opt4);
  document.querySelector("#ratingChart").appendChild(selectBox);
  selectBox.setAttribute('id','selectBox');
}

function modifypage()
{

  var div1 = document.createElement("div");
  div1.className="roundbox userActivityRoundBox borderTopRound borderBottomRound"
  div1.style="padding: 1em 1em 1em 1.5em";
  div1.id = "ratingChart";
  document.querySelector("#pageContent").appendChild(div1);

  addSelect();
  
  var user1=new User(getProfile());
  async function logData() {
    await user1.getProblemData();
    let typ = "all";
    await user1.displayBarGraph("all");

    var mySelect = document.getElementById('selectBox');
      mySelect.addEventListener('change', async function(event){
        typ = event.target.value;
        await user1.displayBarGraph(typ);
      });
  }
  logData();
};
