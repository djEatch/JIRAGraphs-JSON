"use strict";

var serverAddress = 'http://svn.na-dc.ah.ab:8080';

var options = {};

var JSONfile;
var piData = {};
var wholePi = [];
var stories = [];

var mode = "Assignee";

var categoryList = [];
var positionList = [];
var colourList = [];

function preload(){
  JSONfile = loadJSON("./test.json",gotJSON);
}

function gotJSON(data){
  console.log(data);
}

function setup() {
    createCanvas(window.innerWidth,window.innerHeight);
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

  for (var i = 0; i < positionList.length; i++) {
    var l = positionList[i];
    //stroke(l.c,150,150);
    stroke(0);
    strokeWeight(0);
    textSize(20);
    text(l.id,l.x,l.y);
  }

  for (var i = 0; i < stories.length; i++) {
    var s = stories[i];
    s.behaviors();
    s.update();
    s.show();
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
    setAllMode(mode,"Assignee");
  }
}

function getKey(_thing, _i){
  var key;
  switch(_thing){
    case "Assignee":
      key = stories[_i].assignee;
      break;
    case "Epic":
      key = stories[_i].epic;
      break;
    case "Platform":
      key = stories[_i].platform;
      break;
    default:
      alert("BBBBBAD");
      key = null;
      break;
  }

  return key
}

function buildList(_list, _key){
  var isInList = false;
  for (var j = 0; j< _list.length; j++ ){
    if (_list[j].id == _key){
      isInList = true;
      _list[j].count +=1;
      break
    }
  }
  if(!isInList){
    _list.push({id:_key,count:1})
  }
}

function setAllMode(_posmode, _colmode){
  
    positionList = [];
    colourList = [];
  
    for (var i = 0; i < stories.length; i++) {
      var posKey = getKey(_posmode,i);
      var colKey = getKey(_colmode,i);

      buildList(positionList, posKey);
      buildList(colourList, colKey);
    }
  
    var colourSplit = 360/colourList.length //360 for HSB, or 255 for Grey
    var degreeSplit = 360/positionList.length
  
    for (var j = 0; j< positionList.length; j++ ){
      positionList[j].x = ((min(height,width)/2)-20) * cos(radians(j*degreeSplit)) + width/2;
      positionList[j].y = ((min(height,width)/2)-20) * sin(radians(j*degreeSplit)) + height/2;
    }

    for (var j = 0; j< colourList.length; j++ ){
      colourList[j].c = colourSplit*(j + 1);
    }
  
    console.log(positionList);
    console.log(colourList);
  
    for (var i = 0; i < stories.length; i++) {
      var s = stories[i];
      for (var j = 0; j< positionList.length; j++ ){
        var include = false;
        switch(_posmode){
          case "Assignee":
            include = (positionList[j].id == s.assignee);
            break;
          case "Epic":
            include = (positionList[j].id == s.epic);
            break;
          case "Platform":
            include = (positionList[j].id == s.platform);
            break;
          default:
            alert("BBBBBAD");
            break;
        }
        if (include){
          s.target = createVector(positionList[j].x, positionList[j].y);
          break
        }
      }
    }

    for (var i = 0; i < stories.length; i++) {
      var s = stories[i];
      for (var j = 0; j< colourList.length; j++ ){
        var include = false;
        switch(_colmode){
          case "Assignee":
            include = (colourList[j].id == s.assignee);
            break;
          case "Epic":
            include = (colourList[j].id == s.epic);
            break;
          case "Platform":
            include = (colourList[j].id == s.platform);
            break;
          default:
            alert("BBBBBAD");
            break;
        }
        if (include){
          s.c = colourList[j].c;
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