// "use strict";
// var tokenJSON;
// var createReleaseRequired = true;
// var overWriting;
// var incGlobal;
// var globalInGlobal;
// var globalOverwrite;
// var thisReleaseName;
// var thisReleaseID;
// var relInput;

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

// function gotLoginData(data){
//     tokenJSON = JSON.parse(data);
//     console.log(tokenJSON.token);
//     relInput = createInput('x.y.z');
//     relInput.parent('relSelectDiv');
//     var relButton = createButton('Go');
//     relButton.mousePressed(gotRelInput);
//     relButton.parent('relSelectDiv');
// }

// function gotRelInput(){
//     thisReleaseName = relInput.value();
//     document.getElementById('relSelectDiv').innerHTML="";

//     postRequest(gotRelList, serverAddress + '/api/releases/complete', '{"query":"' + thisReleaseName + '","maxResults":"100"}',tokenJSON.token);

//     var relLabel = createP("Release: " + thisReleaseName);
//     relLabel.parent('relSelectDiv');

// }

// function gotRelList(data){
    
//     var relListJSON = JSON.parse(data);
//     var relCount = relListJSON.length;

//     var relCountLabel = createP("Count: " + relCount);
//     relCountLabel.parent('relSelectDiv');

//     var relMatch = false;

//     // radio = createRadio();
//     // radio.parent('relOptionsDiv');

//     // radio.style('width', '200px');

//     if(relCount==0){
//         //use thisrelease to create new release and then capture it's ID
//         //createRelease(thisReleaseName);
//         createReleaseRequired = true;
//         showGlobalOptions();
//     } else {
//         for(var relItem of relListJSON){ //Cycle through names, do they equal thisrelease

//             // radio.option(relItem.name, relItem.id);
//             if(relItem.name==thisReleaseName){
//                 //Yes, use id of this match
//                 relMatch=true;
//                 thisReleaseID = relItem.id;
//                 createReleaseRequired = false;
//                 // ask user if we are appending/duplicating or overwriting on clashes.
//                 var relCountLabel = createP("Release: " + thisReleaseName + ' exists. Do you want to: ').parent('fileSelectDiv');
//                 var appendButton = createButton('Append').parent('fileSelectDiv');
//                 var overwriteButton = createButton('Overwrite').parent('fileSelectDiv');
//                 appendButton.mousePressed(function(){overWriting=false; showGlobalOptions();});
//                 //overwriteButton.mousePressed(function(){overWriting=true; showGlobalOptions();}); //re-instate once overwrite is coded
               
//                 break;
//             }
//         }
        
//         if (!relMatch){
//             //No, thisrelease to create new release and then capture it's ID
//             //createRelease(thisReleaseName);
//             createReleaseRequired = true;
//             showGlobalOptions();
//         }
//     }


// }

// function showGlobalOptions(){
//   document.getElementById('fileSelectDiv').innerHTML="";
//   if (createReleaseRequired){
//     createP("Release: " + thisReleaseName + ' to be created.').parent('fileSelectDiv');
//   } else {
//     createP("Release: " + thisReleaseName + ' exists.').parent('fileSelectDiv');
//     if(overWriting){
//       createP("OVERWRITING Existing Matching parameter").parent('fileSelectDiv');
//     } else{
//       createP("APPENDING to Existing Matching parameters - may cause duplicates").parent('fileSelectDiv');
//     }
//   }
//   createP("Do you want to load Globals into release config or global gonfig? Should existing macthes be overwritten or appended to?").parent('fileSelectDiv');
//   //createButton('Include').parent('fileSelectDiv').mousePressed(function(){incGlobal=true; showFileSelectOptions();});
//   createButton('Exclude').parent('fileSelectDiv').mousePressed(function(){incGlobal=false; showFileSelectOptions();});
//   createButton('Include - Global - Overwrite').parent('fileSelectDiv');//.mousePressed(function(){incGlobal=true; globalInGlobal=true; globalOverwrite=true; showFileSelectOptions();});
//   createButton('Include - Release - Overwrite').parent('fileSelectDiv');//.mousePressed(function(){incGlobal=true; globalInGlobal=false; globalOverwrite=true; showFileSelectOptions();});
//   createButton('Include - Global - Append').parent('fileSelectDiv').mousePressed(function(){incGlobal=true; globalInGlobal=true; globalOverwrite=false; showFileSelectOptions();});
//   createButton('Include - Release - Append').parent('fileSelectDiv').mousePressed(function(){incGlobal=true; globalInGlobal=false; globalOverwrite=false; showFileSelectOptions();});
// }

// function showFileSelectOptions(){
//   document.getElementById('fileSelectDiv').innerHTML="";
//   if (createReleaseRequired){
//     createP("Release: " + thisReleaseName + ' to be created.').parent('fileSelectDiv');
//   } else {
//     createP("Release: " + thisReleaseName + ' exists.').parent('fileSelectDiv');
//     if(overWriting){
//       createP("OVERWRITING Existing Matching parameter").parent('fileSelectDiv');
//     } else{
//       createP("APPENDING to Existing Matching parameters - may cause duplicates").parent('fileSelectDiv');
//     }
//   }
//   createP('Including Globals: ' + incGlobal).parent('fileSelectDiv');
//   if (incGlobal){
//     createP('Store Globals in Global Section: ' + globalInGlobal).parent('fileSelectDiv');
//     createP('Overwriting Globals: ' + globalOverwrite).parent('fileSelectDiv');
//   }
//   createP("Are you loading a single finished file, or multiple Ruby templates").parent('fileSelectDiv');
//   var singleButton = createButton('Single').parent('fileSelectDiv');
//   var multiButton = createButton('Multi').parent('fileSelectDiv');
//   singleButton.mousePressed(function(){multiFiles=false; showSingleFileSelect();});
//   multiButton.mousePressed(function(){multiFiles=true; showMultiFileSelect();});
// }

// function showMultiFileSelect(){
//     console.log(multiFiles);
//     document.getElementById('fileSelectDiv').innerHTML="";
//     if (createReleaseRequired){
//       createP("Release: " + thisReleaseName + ' to be created.').parent('fileSelectDiv');
//     } else {
//       createP("Release: " + thisReleaseName + ' exists.').parent('fileSelectDiv');
//       if(overWriting){
//         createP("OVERWRITING Existing Matching parameter").parent('fileSelectDiv');
//       } else{
//         createP("APPENDING to Existing Matching parameters - may cause duplicates").parent('fileSelectDiv');
//       }
//     }
//     createP('Including Globals: ' + incGlobal).parent('fileSelectDiv');
//     if (incGlobal){
//       createP('Store Globals in Global Section: ' + globalInGlobal).parent('fileSelectDiv');
//       createP('Overwriting Globals: ' + globalOverwrite).parent('fileSelectDiv');
//     }
//     createP("Loading Multiple Files...").parent('fileSelectDiv');
//     createP("Load Main Ruby File:").parent('fileSelectDiv');
//     var fileSelect = createFileInput(gotMainFile); 
//     fileSelect.parent('fileSelectDiv');
// }

// function showSingleFileSelect(){
//     console.log(multiFiles);
//     document.getElementById('fileSelectDiv').innerHTML="";
//     if (createReleaseRequired){
//       createP("Release: " + thisReleaseName + ' to be created.').parent('fileSelectDiv');
//     } else {
//       createP("Release: " + thisReleaseName + ' exists.').parent('fileSelectDiv');
//       if(overWriting){
//         createP("OVERWRITING Existing Matching parameter").parent('fileSelectDiv');
//       } else{
//         createP("APPENDING to Existing Matching parameters - may cause duplicates").parent('fileSelectDiv');
//       }
//     }
//     createP('Including Globals: ' + incGlobal).parent('fileSelectDiv');
//     if (incGlobal){
//       createP('Store Globals in Global Section: ' + globalInGlobal).parent('fileSelectDiv');
//       createP('Overwriting Globals: ' + globalOverwrite).parent('fileSelectDiv');
//     }
//     createP("Loading Single File...").parent('fileSelectDiv');
//     createP("Load Single File:").parent('fileSelectDiv');
//     var fileSelect = createFileInput(gotSingleFile); 
//     fileSelect.parent('fileSelectDiv');
// }

// //------------------------------------------------------------------
// function gotRelConfigResponse(response, origQuery){

// }

// function postRequestRelConfig(callback, url,args,auth,fullLineData){
//   var xhr = new XMLHttpRequest();

//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
//   xhr.setRequestHeader("Authorization",  auth);
//   xhr.send(args);
//   xhr.onreadystatechange = function() {
//     if(xhr.readyState == 4 && xhr.status == 200) {
//       callback(xhr.responseText);
//     }
//     //if respons is present, post back with ID
//     //if response is not present, post as is.
//   }  
   
// }

// function writeReleaseData(){
//     //Do the thing here where you send all the JSON to the API!!!
//     console.log(outputReleaseJSON, outputGlobalJSON,   overWriting,    thisReleaseID,    thisReleaseName);
//     var putData;
//     for(var configLine of outputReleaseJSON){
//       if(!overWriting){
//         //put without checking = append
//         putData = '{"parameter":"'+configLine.paramText +'", "value":'+configLine.valueText +', "hieraAddress":"'+configLine.addressText +'", "recursiveByEnv":"'+ configLine.recurseByEnv +'", "recursiveBySubEnv":"'+ configLine.recurseBySubEnv +'", "notes":"'+configLine.noteText +'", "sensitive":"'+ configLine.sensitive +'", "release":{"id":"'+ thisReleaseID +'"}}'
//         putRequest(appendedReleaseConfig, serverAddress + '/api/releaseConfigs/', putData,tokenJSON.token,relDataError);
//       } else {
//         //overwrite = query by example, if exists get ID & put with ID else put without id (as-is);
//         //postRequestRelConfig(gotRelConfigResponse, serverAddress + '/api/releaseConfigs/complete', '{"query":"' + "BLAH" + '","maxResults":"100"}',tokenJSON.token,configLine);
//       }
//     }

//     for(var configLine of outputGlobalJSON){
//       if(!globalOverwrite){
//         //put without checking = append
//         putData = '{"parameter":"'+configLine.paramText +'", "value":'+configLine.valueText +', "hieraAddress":"'+configLine.addressText +'", "recursiveByEnv":"'+ configLine.recurseByEnv +'", "recursiveBySubEnv":"'+ configLine.recurseBySubEnv +'", "recursiveByRel":"'+ configLine.recurseByRel +'", "notes":"'+configLine.noteText +'", "sensitive":"'+ configLine.sensitive +'"}'
//         putRequest(appendedGlobalConfig, serverAddress + '/api/globalconfigs/', putData,tokenJSON.token,relDataError);
//       } else {
//         //overwrite = query by example, if exists get ID & put with ID else put without id (as-is);
//       }
//     }

//   for(var configLine of outputJSON){
//       if(!globalOverwrite){
//         //put without checking = append
//         if (configLine.configType == 'Global') {
//           putData = '{"parameter":"'+configLine.paramText +'", "value":'+configLine.valueText +', "hieraAddress":"'+configLine.addressText +'", "recursiveByEnv":"'+ configLine.recurseByEnv +'", "recursiveBySubEnv":"'+ configLine.recurseBySubEnv +'", "recursiveByRel":"'+ configLine.recurseByRel +'", "notes":"'+configLine.noteText +'", "sensitive":"'+ configLine.sensitive +'"}'
//           putRequest(appendedGlobalConfig, serverAddress + '/api/globalconfigs/', putData,tokenJSON.token,relDataError);
//         }
//         else if (configLine.configType == 'Release'){
//           putData = '{"parameter":"'+configLine.paramText +'", "value":'+configLine.valueText +', "hieraAddress":"'+configLine.addressText +'", "recursiveByEnv":"'+ configLine.recurseByEnv +'", "recursiveBySubEnv":"'+ configLine.recurseBySubEnv +'", "notes":"'+configLine.noteText +'", "sensitive":"'+ configLine.sensitive +'", "release":{"id":"'+ thisReleaseID +'"}}'
//           putRequest(appendedReleaseConfig, serverAddress + '/api/releaseConfigs/', putData,tokenJSON.token,relDataError);
//         } else {
//           //other config types here
//           console.log ('No home', configLine );
//         }

//       } else {
//         //overwrite = query by example, if exists get ID & put with ID else put without id (as-is);
//       }
//     }
    
// }

// function appendedReleaseConfig(data){
//   //console.log('Success: ' + data);
// }
// function appendedGlobalConfig(data){
//   //console.log('Success: ' + data);
// }

// function relDataError(data){
//   console.log('FAILED: ' + data);
// }

// function createRelError(data){
//   console.log('FAILED: ' + data);
// }

// /*
// {
//   parameter : ,
//   value : ,
//   hieraAddress : ,
//   recursiveByEnv : ,
//   recursiveBySubEnv : ,
//   notes: ,
//   sensitive :, 
// 	release:{id:10}
// }
// */

// //------------------------------------------------------------------

// function createRelease(){
//     console.log('createRelease',thisReleaseName);
//     overWriting = false;
//     putRequest(createdTheRelease, serverAddress + '/api/releases/', '{"name":"' + thisReleaseName + '"}',tokenJSON.token,createRelError);
// }

// function createdTheRelease(data){
//     var createdJSON = JSON.parse(data);
//     thisReleaseID = createdJSON.id;
//     console.log(thisReleaseID);
//     writeReleaseData();
// }


// function getRequest(callback, url,auth){
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", url, true);
//   xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//   xhr.setRequestHeader("Authorization",  auth);
//   xhr.send();
//   xhr.onreadystatechange = function() {
//     if(xhr.readyState == 4 && xhr.status == 200) {
//       callback(xhr.responseText);
//     }
//   }  
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

// function putRequest(callback, url,args,auth, errCallback){
//   var xhr = new XMLHttpRequest();

//   xhr.open("PUT", url, true);
//   xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
//   xhr.setRequestHeader("Authorization",  auth);
//   xhr.send(args);
//   xhr.onreadystatechange = function() {
//     if(xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
//       callback(xhr.responseText);
//     } else if(xhr.readyState == 4 && xhr.status >= 400) {
//       errCallback(args + xhr.responseText);
//     }
//   }  
   
// }
