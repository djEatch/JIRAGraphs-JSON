"use strict";

var serverAddress = 'http://svn.na-dc.ah.ab:8080';

var options = {};

var JSONfile;
var piData = {};
var wholePi = [];
var stories = [];

var mode = "Assignee";
var labelList = [];
var categoryList = [];

function preload(){
  JSONfile = loadJSON("./test.json",gotJSON);
}

function gotJSON(data){
  console.log(data);
}

function setup() {
    createCanvas(800,600);
    background(51);
    //fill(100);
    //createP('Connecting to: ' + serverAddress).parent('headerDiv');
    //basicQuery(gotBasicJSON, serverAddress + '/rest/api/2/search','{"jql":"Project=\'CDES\'"}');
    ////getToken(gotTokenJSON, serverAddress + '/api/login','{"username":"duncan","password":"password"}');
    

    //JSONfile = loadJSON("https://cors.io/?u=http://svn.na-dc.ah.ab:8080/rest/api/2/search?jql=Project=CDES",gotJSON);

    extractIssues();
}

function draw(){
  background(51);
  //pieChart(300,wholePi);
  colorMode(HSB);
  for (var i = 0; i < stories.length; i++) {
    var s = stories[i];
    s.behaviors();
    s.update();
    s.show();
  }
  
  for (var i = 0; i < categoryList.length; i++) {
    var l = categoryList[i];
    stroke(l.c,150,150);
    text(l.id,l.x,l.y);
  }

}

function keyPressed(){
  if (keyCode== 32){
    if(mode=="Assignee"){
      mode="Epic";
    } else if(mode=="Epic"){
      mode="Platform"
    } else {
      mode="Assignee"
    }
    setMode(mode);
  }
}

function setMode(_mode){
  
    categoryList = [];
  
    for (var i = 0; i < stories.length; i++) {
      var key;
      switch(_mode){
        case "Assignee":
          key = stories[i].assignee;
          break;
        case "Epic":
          key = stories[i].epic;
          break;
        case "Platform":
          key = stories[i].platform;
          break;
        default:
          alert("BBBBBAD");
          break;
      }
      
      var isInList = false;
      for (var j = 0; j< categoryList.length; j++ ){
        if (categoryList[j].id == key){
          isInList = true;
          categoryList[j].count +=1;
          break
        }
      }
      if(!isInList){
        categoryList.push({id:key,count:1})
      }
    }
  
    var colourSplit = 255/categoryList.length
    var degreeSplit = 360/categoryList.length
  
    for (var j = 0; j< categoryList.length; j++ ){
      categoryList[j].c = colourSplit*(j + 1);
  
      categoryList[j].x = ((height/2)-20) * cos(radians(j*degreeSplit)) + width/2;
      categoryList[j].y = ((height/2)-20) * sin(radians(j*degreeSplit)) + height/2;

    }
  
    console.log(categoryList);
  
    for (var i = 0; i < stories.length; i++) {
      var s = stories[i];
      for (var j = 0; j< categoryList.length; j++ ){
        var include = false;
        switch(_mode){
          case "Assignee":
            include = (categoryList[j].id == s.assignee);
            break;
          case "Epic":
            include = (categoryList[j].id == s.epic);
            break;
          case "Platform":
            include = (categoryList[j].id == s.platform);
            break;
          default:
            alert("BBBBBAD");
            break;
        }
        if (include){
          s.c = categoryList[j].c;
          s.target = createVector(categoryList[j].x, categoryList[j].y);
          break
        }
      }
    }
  }

function extractIssues(){
  for(var i = 0; i<JSONfile.issues.length;i++){
    if(JSONfile.issues[i].fields.issuetype.name=="Story"){
      console.log(JSONfile.issues[i].key, JSONfile.issues[i].fields.customfield_10353, JSONfile.issues[i].fields.fixVersions[0].name, JSONfile.issues[i].fields.assignee.displayName);
      var newPiData = {title: JSONfile.issues[i].key, assignee: JSONfile.issues[i].fields.assignee.displayName, points:JSONfile.issues[i].fields.customfield_10353, percentage:undefined };
      if (newPiData.points) {wholePi.push(newPiData);}

      var _assignee = JSONfile.issues[i].fields.assignee.displayName;
      var _name = JSONfile.issues[i].key;
      var _points = JSONfile.issues[i].fields.customfield_10353;
      var _fixVersion = JSONfile.issues[i].fields.fixVersions[0].name.split("-")
      var _platform = _fixVersion[0] + "-" + _fixVersion[1];
      var _phase = _fixVersion[1].split(" ")[0]
      var _epic = JSONfile.issues[i].fields.customfield_10554;
      if (_points){
        var story = new Story(_name,_points,_assignee, _platform, _phase, _epic)
        stories.push(story);
      }
    }
  }

  var piTotalAmount = 0;
  for(var i = 0; i<wholePi.length;i++){
    if(!wholePi[i].points){wholePi[i].points = 0;}
    piTotalAmount+=wholePi[i].points;
  
  }
  for(var i = 0; i<wholePi.length;i++){
    wholePi[i].percentage = wholePi[i].points/piTotalAmount*100;
  }

  console.log(wholePi);
  pieChart(300,wholePi);

}


function pieChart(diameter, data) {
  var lastAngle = 0;
  for (var i = 0; i < data.length; i++) {
    var gray = map(i, 0, data.length, 0, 255);
    fill(gray);
    stroke(0);
    arc(width/2, height/2, diameter, diameter, lastAngle, lastAngle+radians(data[i].percentage/100*360));
    var x = ((diameter/2)+40) * cos(lastAngle+radians(data[i].percentage/100*360/2) );
    var y = ((diameter/2)+40) * sin(lastAngle+radians(data[i].percentage/100*360/2) );
    var x1 = ((diameter/2)+30) * cos(lastAngle+radians(data[i].percentage/100*360/2) );
    var y1 = ((diameter/2)+30) * sin(lastAngle+radians(data[i].percentage/100*360/2) );
    var x2 = (diameter/2) * cos(lastAngle+radians(data[i].percentage/100*360/2) );
    var y2 = (diameter/2) * sin(lastAngle+radians(data[i].percentage/100*360/2) );
    fill(0);
    textAlign(CENTER,CENTER);
    text(data[i].title,width/2+x,height/2+y)
    line(width/2+x1,height/2+y1,width/2+x2,height/2+y2);
    lastAngle += radians(data[i].percentage/100*360);
  }
}


function basicQuery(callback,url,args){
  var xhr = new XMLHttpRequest();
  var params = args;

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.setRequestHeader("Authorization", "Basic ZGVhdGNoOlBhc3N3MHJk");
  xhr.setRequestHeader("X-Atlassian-Token", "no-check");
  
  xhr.send(params);

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      callback(xhr.responseText);
    }
    if(xhr.readyState == 4 && xhr.status != 200) {
      createP('Connection Failed: ' + xhr.responseText).parent('headerDiv');
    }
  }  
}

function gotBasicJSON(data){
  var objData = JSON.parse(data);
  console.log(objData);
}

// Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};