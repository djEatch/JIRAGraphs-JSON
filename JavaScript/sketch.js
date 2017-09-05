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
  
  // for (var i = 0; i < labelList.length; i++) {
  //   var l = labelList[i];
  //   stroke(l.c);
  //   text(l.text,l.x,l.y);
  // }

  for (var i = 0; i < categoryList.length; i++) {
    var l = categoryList[i];
    stroke(l.c,150,150);
    text(l.id,l.x,l.y);
  }

}

function keyPressed(){
  if (keyCode== 32){
    //setModeAssignee();
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

// function changeMode(){
//   for (var i = 0; i < stories.length; i++) {
//     var s = stories[i];
//     s.c = random(255);
//     s.target = createVector(random(width), random(height));
//   }
// }

function setMode(_mode){
  
    categoryList = [];
    //labelList = [];
  
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
  
      // var label = {text:categoryList[j].id, x:categoryList[j].x, y:categoryList[j].y, c:categoryList[j].c};
      // labelList.push(label);
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

function setModeAssignee(){

  var assigneeList = [];
  labelList = [];

  for (var i = 0; i < stories.length; i++) {
    var assigneename = stories[i].assignee;
    var isInList = false;
    for (var j = 0; j< assigneeList.length; j++ ){
      if (assigneeList[j].name == assigneename){
        isInList = true;
        assigneeList[j].count +=1;
        break
      }
    }
    if(!isInList){
      assigneeList.push({name:assigneename,count:1})
    }
  }

  var colourSplit = 255/assigneeList.length
  var degreeSplit = 360/assigneeList.length

  for (var j = 0; j< assigneeList.length; j++ ){
    assigneeList[j].c = colourSplit*(j + 1);

    assigneeList[j].x = ((height/2)-20) * cos(radians(j*degreeSplit)) + width/2;
    assigneeList[j].y = ((height/2)-20) * sin(radians(j*degreeSplit)) + height/2;

    var label = {text:assigneeList[j].name, x:assigneeList[j].x, y:assigneeList[j].y, c:assigneeList[j].c};
    labelList.push(label);
  }

  console.log(assigneeList);

  for (var i = 0; i < stories.length; i++) {
    var s = stories[i];
    for (var j = 0; j< assigneeList.length; j++ ){
      if (assigneeList[j].name == s.assignee){
        s.c = assigneeList[j].c;
        s.target = createVector(assigneeList[j].x, assigneeList[j].y);
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

// function getToken(callback, url,args){
//   var xhr = new XMLHttpRequest();
//   var params = args;

//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
//   xhr.send(params);

//   xhr.onreadystatechange = function() {
//     if(xhr.readyState == 4 && xhr.status == 200) {
//       callback(xhr.responseText);
//     }
//     if(xhr.readyState == 4 && xhr.status != 200) {
//       createP('Connection Failed: ' + xhr.responseText).parent('headerDiv');
//     }
//   }  
// }

// function gotTokenJSON(data){
//     var objToken = JSON.parse(data);
//     token = objToken.token;
//     console.log(token);
//     relInput = createInput('x.y.z');
//     relInput.parent('relSelectDiv');
//     var relButton = createButton('Go');
//     relButton.mousePressed(getRelList);
//     relButton.parent('relSelectDiv');
// }

// function getRelList(){
//     thisRelease.name = relInput.value();
//     document.getElementById('relSelectDiv').innerHTML="";
//     postRequest(checkRelExists, serverAddress + '/api/releases/complete', '{"query":"' + thisRelease.name + '","maxResults":"100"}', token);
//     var relLabel = createP("Release: " + thisRelease.name);
//     relLabel.parent('relSelectDiv');
// }

// function postRequest(callback, url,args,auth){
//   var xhr = new XMLHttpRequest();

//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
//   xhr.setRequestHeader("Authorization",  auth);
//   xhr.send(args);
//   xhr.onreadystatechange = function() {
//     if(xhr.readyState == 4 && xhr.status == 200) {
//       callback(xhr.responseText);
//     }
//   }  
   
// }

// function checkRelExists(data){
    
//     var relListJSON = JSON.parse(data);
//     var relCount = relListJSON.length;

//     var relCountLabel = createP("Count: " + relCount);
//     relCountLabel.parent('relSelectDiv');

//     if(relCount==0){
//         //use thisrelease to create new release and then capture it's ID
//         //createRelease(thisReleaseName);
//         options.createReleaseRequired = true;
//         showGlobalOptions();
//     } else {
//         var relMatch = false;
//         for(var relItem of relListJSON){ //Cycle through names, do they equal thisrelease
//             // radio.option(relItem.name, relItem.id);
//             if(relItem.name==thisRelease.name){
//                 //Yes, use id of this match
//                 relMatch=true;
//                 thisRelease.id = relItem.id;
//                 options.createReleaseRequired = false;
//                 // ask user if we are appending/duplicating or overwriting on clashes.
//                 var relCountLabel = createP("Release: " + thisRelease.name + ' exists. Do you want to: ').parent('fileSelectDiv');
//                 var appendButton = createButton('Append').parent('fileSelectDiv');
//                 var overwriteButton = createButton('Overwrite').parent('fileSelectDiv');
//                 appendButton.mousePressed(function(){options.overWriting=false; showGlobalOptions();});
//                 //overwriteButton.mousePressed(function(){overWriting=true; showGlobalOptions();}); //re-instate once overwrite is coded
//                 overwriteButton.mousePressed(function(){alert("No Overwite Developed Yet...");}); //re-instate once overwrite is coded
//                 break;
//             }
//         }
        
//         if (!relMatch){
//             //No match, use thisrelease to create new release and then capture it's ID
//             options.createReleaseRequired = true;
//             showGlobalOptions();
//         }
//     }
// }

// function showGlobalOptions(){
//   document.getElementById('fileSelectDiv').innerHTML="";
//   if (options.createReleaseRequired){
//     createP("Release: " + thisRelease.name + ' to be created.').parent('fileSelectDiv');
//   } else {
//     createP("Release: " + thisRelease.name + ' exists.').parent('fileSelectDiv');
//     if(options.overWriting){
//       createP("OVERWRITING Existing Matching parameter").parent('fileSelectDiv');
//     } else{
//       createP("APPENDING to Existing Matching parameters - may cause duplicates").parent('fileSelectDiv');
//     }
//   }
//   createP("Do you want to load Globals into release config or global gonfig? Should existing macthes be overwritten or appended to?").parent('fileSelectDiv');
//   createButton('Exclude').parent('fileSelectDiv').mousePressed(function(){options.incGlobal=false; showFileSelectOptions();});
//   //createButton('Include - Global - Overwrite').parent('fileSelectDiv').mousePressed(function(){incGlobal=true; globalInGlobal=true; globalOverwrite=true; showFileSelectOptions();});
//   //createButton('Include - Release - Overwrite').parent('fileSelectDiv').mousePressed(function(){incGlobal=true; globalInGlobal=false; globalOverwrite=true; showFileSelectOptions();});
//   createButton('Include - Global - Overwrite').parent('fileSelectDiv').mousePressed(function(){alert("No Overwite Developed Yet...");});
//   createButton('Include - Release - Overwrite').parent('fileSelectDiv').mousePressed(function(){alert("No Overwite Developed Yet...");});
//   createButton('Include - Global - Append').parent('fileSelectDiv').mousePressed(function(){options.incGlobal=true; options.globalInGlobal=true; options.globalOverwrite=false; showFileSelectOptions();});
//   createButton('Include - Release - Append').parent('fileSelectDiv').mousePressed(function(){options.incGlobal=true; options.globalInGlobal=false; options.globalOverwrite=false; showFileSelectOptions();});
// }

// function showFileSelectOptions(){
//   document.getElementById('fileSelectDiv').innerHTML="";
//   if (options.createReleaseRequired){
//     createP("Release: " + thisRelease.name + ' to be created.').parent('fileSelectDiv');
//   } else {
//     createP("Release: " + thisRelease.name + ' exists.').parent('fileSelectDiv');
//     if(options.overWriting){
//       createP("OVERWRITING Existing Matching parameter").parent('fileSelectDiv');
//     } else{
//       createP("APPENDING to Existing Matching parameters - may cause duplicates").parent('fileSelectDiv');
//     }
//   }
//   createP('Including Globals: ' + options.incGlobal).parent('fileSelectDiv');
//   if (options.incGlobal){
//     createP('Store Globals in Global Section: ' + options.globalInGlobal).parent('fileSelectDiv');
//     createP('Overwriting Globals: ' + options.globalOverwrite).parent('fileSelectDiv');
//   }

//   createP("Load XML File:").parent('fileSelectDiv');
//   var fileSelect = createFileInput(gotSingleFile); 
//   fileSelect.parent('fileSelectDiv');

// }

// function gotSingleFile(file) {
//     console.log(file);
//     var gotInput = false;
//     var theXML;
//     if (file.type === 'text' && file.subtype === 'xml') {
//         //singleFile = file.data.split('\n');
//         var parser = new DOMParser()
//         theXML = parser.parseFromString(file.data, "text/xml");


//         console.log(theXML);

//         var configsJSON = xmlToJson(theXML);

//         for (var i = 0; i<configsJSON.config.globalConfigSection.itemList.globalItem.length; i++) {
//           var tempConfig = configsJSON.config.globalConfigSection.itemList.globalItem[i]

//           var valueCount = tempConfig.values.value.length
//           if (!valueCount){
//             console.log(tempConfig.address['#text'] + ' - ' + tempConfig.parameter['#text'] + ' - ' + tempConfig.values.value['#text']);
//           } else {
//             for (var j=0; j<valueCount; j++){
//               console.log(tempConfig.address['#text'] + ' - ' + tempConfig.parameter['#text'] + ' - ' + tempConfig.values.value[j]['#text']);
//             }
//           }
//         }

//         for (var i = 0; i<configsJSON.config.releaseConfigSection.itemList.releaseItem.length; i++) {
//           var tempConfig = configsJSON.config.releaseConfigSection.itemList.releaseItem[i]

//           var valueCount = tempConfig.values.value.length
//           if (!valueCount){
//             console.log(tempConfig.address['#text'] + ' - ' + tempConfig.parameter['#text'] + ' - ' + tempConfig.values.value['#text']);
//           } else {
//             for (var j=0; j<valueCount; j++){
//               console.log(tempConfig.address['#text'] + ' - ' + tempConfig.parameter['#text'] + ' - ' + tempConfig.values.value[j]['#text']);
//             }
//           }
//         }

//         // var configs = theXML.getElementsByTagName("config");
//         // var globalConfigs = theXML.getElementsByTagName("globalConfigSection");
//         // var releaseConfigs = theXML.getElementsByTagName("releaseConfigSection");
//         // var envConfigs = theXML.getElementsByTagName("environmentConfigSection");
//         // console.log(configs);
//         // console.log(globalConfigs);
//         // console.log(releaseConfigs);
//         // console.log(envConfigs);

//         // for (var i = 0; i < configs[0].childNodes.length; i++){
//         //     console.log(configs[0].childNodes);
//         // }

//         // for (var i in configs[0].childNodes){
//         //     console.log(configs[0].childNodes[i]);
//         // }


//         gotInput = true;
//     } else if (file.type ===''){
//         //singleFile = atob(file.data.substring(13)).split('\n');
//         gotInput = true;
//     }

//     if(gotInput){
//         alert('Loaded Shizzle');
//         //generateCMDBvalues(singleFile,'hieraSingleNEW');
//     }
// }

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