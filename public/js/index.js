//var arr = new Array();

var DelphiDemo = DelphiDemo || (function() {
  var self = {};
  var distQ = new Array();
  var arr = new Array();
  var tmp = {charge:"", freq:0};
  var delphiZip;
  var cnt;
  
  /** 
   * Send an ajax request to the server to retrieve delphi db data.
   */ 
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

  /** 
   * initialize 
   */
  self.init = function() {
    //self.getDelphiData();
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

  self.set2013 = function(){
    console.log("Getting new data for 2013");
    $.get("/getQuery/2013", delphiZip && {zipcode: delphiZip}, function(data) {
      console.log(delphiZip);
      var ind = 0;
      var rows = $.map(data, function (item, i) {
        //var tmp = {charge:'', freq:{yr1:0, yr2: 0}, total:0};
        //tmp.charge = item.charge_description;
        for(var i = 0; i < distQ.length; i++){
          if(item.charge_description == distQ[i].charge){
            console.log("The charge from the query is " + item.charge_description + " and the charge from the distQ is " + distQ[i].charge);
            distQ[i].freq.yr1 = item.yr1;
            distQ[i].freq.yr2 = distQ[i].total - item.yr1;        
            console.log("The number of " + distQ[i].charge + " is " + distQ[i].freq.yr1);
          }
        }
      }).join("");
    });
  };

  // self.set2014 = function(){
  //   console.log("Getting new data for 2014");
  //   $.get("/getQuery/2014", delphiZip && {zipcode: delphiZip}, function(data) {
  //     console.log(delphiZip);
  //     var ind = 0;
  //     var rows = $.map(data, function (item, i) {
  //       //var tmp = {charge:'', freq:{yr1:0, yr2: 0}, total:0};
  //       //tmp.charge = item.charge_description;
  //       distQ[ind].freq.yr1 = item.yr2;
  //       console.log("The number of " + distQ[ind].charge + " is " + distQ[ind].freq.yr2);
  //       ind++;
  //     }).join("");
  //   });
  // };

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

  return self;
})();



$(document).ready(function() {
  DelphiDemo.init();

  // Event handler for zip code input box
  $('#custom-zip').submit(function(evt) {
    var value = $(evt.target).find('.target').val();
    if(!isNaN(parseFloat(value)) && isFinite(value)) {
      console.log(value);
      DelphiDemo.getNewData(value);
      DelphiDemo.setQ();
      DelphiDemo.set2013();
    }
    evt.preventDefault();
  });
});
