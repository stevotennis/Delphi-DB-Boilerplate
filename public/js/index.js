//var arr = new Array();

var DelphiDemo = DelphiDemo || (function() {
  var self = {};
  var distQ = new Array();
  var arr = new Array();
  //var tmp = {charge:"", freq:0};
  var delphiZip;
  //var cnt;
  var wcArray;
  var wc2d = [];
  var charge = []
  var charges = [];
  var num = [];
  var nums = [];
  
  self.getButton = function(input){
    self.getNewData(input.innerHTML);
    self.setQ();
    self.set2013();
    self.setWordCloud();
  }

  self.getZip = function() {
    console.log("3) IN GET_SEARCH_ZIP");
    $.getJSON("/zip", function(data) {
      console.log("GET ZIP SHIT MOTHA Facker@@@@@");
      var rows = $.map(data, function (item, i) {
        console.log(item.community);
        //arr.push(item.charge_description);

        return "<tr><td>" + item.community + '</td><td id="clickzip"><button onclick="DelphiDemo.getButton(this)">' + item.zip + "</button></td></tr>";
      }).join("");
      //console.log("rows " + rows);
      
      //console.log(arr);
      $("#zipTable").append(rows);
    });
  };

  /** 
   * Send an ajax request to the server to retrieve delphi db data.
   */ 
   /*
  self.getDelphiData = function() {
    $.getJSON("/delphidata", function(data) {
      var rows = $.map(data, function (item, i) {
        //console.log(item.agency);
        //arr.push(item.charge_description);
        return "<tr><td>" + item.agency + "</td><td>" + item.charge_description + "</td><td>" + item.activity_date + "</td><td>" + item.block_address + "</td><td>" + item.zip + "</td><td>" + item.community + "</td></tr>";
      }).join("");
      //console.log(rows);
      
      //console.log(arr);
      $("#delphi-table").append(rows);
    });


  };
  */

  /** 
   * initialize 
   */
  self.init = function() {
    console.log("2) IN INIT");
    self.getZip();
    console.log("4) END INIT");
  };

  self.setQ = function(){
    console.log("Getting new Query from here for D3");
    $.get("/getQuery", delphiZip && {zipcode: delphiZip}, function(data) {
      console.log(delphiZip);
      var rows = $.map(data, function (item, i) {
        var tmp = {charge:'', freq:{yr1:0, yr2: 0}, total:0};
        //tmp.charge = item.charge_description;
        tmp.charge = item.charge_description;
        tmp.total = item.num;
        tmp.freq.yr1 = item.num;
        tmp.freq.yr2 = item.num -1;
        //tmp.freq.yr2 = 0;
        //if(arr.length < 10)
          distQ.push(tmp);
      }).join("");
    });
  };


  // setting up the number of crime for 2013 and 2014 
  self.set2013 = function(){
    console.log("Getting new data for 2013");
    $.get("/getQuery/2013", delphiZip && {zipcode: delphiZip}, function(data) {
      console.log(delphiZip);
      var ind = 0;
      var rows = $.map(data, function (item, i) {
        //var tmp = {charge:'', freq:{yr1:0, yr2: 0}, total:0};
        //tmp.charge = item.charge_description;
        for(var i = 0; i < distQ.length; i++){
          console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

          if(item.charge_description == distQ[i].charge){
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log("The charge from the query is " + item.charge_description + " and the charge from the distQ is " + distQ[i].charge);
            distQ[i].freq.yr1 = item.yr1;
            distQ[i].freq.yr2 = distQ[i].total - item.yr1;        
            console.log("The number of " + distQ[i].charge + " is " + distQ[i].freq.yr1);
          }
        }
      }).join("");
    });
  };

  // Use user input to render new stuff
  self.getNewData = function(zip){
    console.log("#### In getNewData: " + zip);
    console.log("Getting data");
    delphiZip = zip;
    
    // Get new data
    var par = document.getElementById("delphi-table");
    while(par.hasChildNodes()){
      par.removeChild(par.firstChild);
    }

    $.get("/delphidata", zip && {zipcode: zip}, function(data) {
      //if(!verifyData(data, zip)) return;
      //console.log("## In getNewData: " + data);
      var rows = $.map(data, function (item, i) {
        var tmp = {charge:'', freq:{yr1:0, yr2: 0}, total:0};
        //tmp.charge = item.charge_description;
        tmp.charge = item.charge_description;
        tmp.total = item.num;
        //tmp.freq.yr1 = item.num;
        //tmp.freq.yr2 = item.num -1;
        //tmp.freq.yr2 = 0;
        //if(arr.length < 10)
        arr.push(tmp);
        // console.log(tmp.charge);
        // console.log(tmp.freq);
        //console.log(arr[arr.length-1].charge);
        //console.log(arr[arr.length-1].freq);

        return "<tr><td>" + item.agency + "</td><td>" + item.charge_description + "</td><td>" + item.activity_date + "</td><td>" + item.block_address + "</td><td>" + item.zip + "</td><td>" + item.community + "</td></tr>";
      }).join("");
      $("#delphi-table").append(rows);
      }
    );
  };

  self.printQ = function(){
    for(var i = 0; i < arr.length; i++){
        console.log("The element @ index (" + i + ") is " + arr[i].charge + "with toatl of " + arr[i].total + " occurances.\n");
        //console.log("The element @ index (" + i + ") is " + arr[i] + ".\n");
    }
  }

  self.getQ = function(){
    return arr;
  }

  self.getQQ = function(){
    return distQ;
  }

  self.printQQ = function(){
    for(var i = 0; i < distQ.length; i++){
        console.log("The element in distQ @ index (" + i + ") is " + distQ[i].charge + "that happened a total of (" + distQ[i].total + ") times.\n");
        //console.log("The element @ index (" + i + ") is " + arr[i] + ".\n");
    }
  }

  self.setWordCloud = function(){
    console.log("Inside setWordCloud()");
    $.get("/wordCloud", delphiZip && {zipcode: delphiZip}, function(data) {
      console.log("+++++++ delphiZip: " + delphiZip);
      var rows = $.map(data, function (item, i) {
      
        charge[i] = item.charge_description;
        console.log("charge[" + i + "] = " + charge[i]);

        charges.push(charge[i]);
        console.log("charges = " + charges);
        

        num[i] = item.num;
        console.log("num[" + i + "] = " + num[i]);

        nums.push(num[i]);
        console.log("nums = " + nums);

      }).join("");

      console.log("CHARGES = " + charges);
      console.log(charges.length);

      console.log("NUMS = " + nums);
      console.log(nums.length);

      for(var i=0; i<charges.length && i<nums.length; i++){
        wc2d[i] = [ charges[i], nums[i] ];
      }

      console.log("wc2d = " + wc2d);
      console.log(wc2d);

      console.log(wc2d[0]);
      console.log(wc2d[0][0]);
      console.log(wc2d[0][1]);

      console.log(wc2d[1]);
      console.log(wc2d[1][0]);
      console.log(wc2d[1][1]);

    });
    console.log("END setWordCloud()");
    console.log("wc2d vvvvvvv");
    console.log(wc2d);
    return wc2d;
  };

  self.getWordCloud = function(){
    console.log("Inside getWordCloud()");
    console.log("wc2d = " + wc2d);

    console.log("END getWordCloud()");
    return wc2d;
  }

  return self;
})();



$(document).ready(function() {
  console.log("1) BOOMBABY!!!!!!!!!!!!!!!!!!");
  DelphiDemo.init();
  console.log("5) AFTER INIT in document.ready()");

  // Event handler for zip code input box
  $('#custom-zip').submit(function(evt) {
    var value = $(evt.target).find('.target').val();
    //if(!isNaN(parseFloat(value)) && isFinite(value)) {
      console.log(value);
      DelphiDemo.getNewData(value);
      DelphiDemo.setQ();
      DelphiDemo.set2013();
      DelphiDemo.setWordCloud();
    //}
    evt.preventDefault();
  });
});
