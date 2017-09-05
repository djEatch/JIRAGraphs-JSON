"use strict";
var startRow = 1;

var debug = false;
var indentedArrays = true;

var serverAddress = 'http://gbrpmscdbt02.corp.internal:8081';
//var serverAddress = 'http://centd643512w5q:8080';

var singleFile, mainFile, envFile, intFile, relFile;
var multiFiles;
var envJSON = [];
var relJSON = [];
var intJSON = [];



function setup() {
    createCanvas(100,100);
    fill(0);
    createP('Connecting to: ' + serverAddress).parent('headerDiv');
    getToken(gotLoginData, serverAddress + '/api/login','{"username":"duncan","password":"password"}');
}



function ltrim(stringToTrim) {
	return stringToTrim.replace(/^\s+/,"");
}
function rtrim(stringToTrim) {
	return stringToTrim.replace(/\s+$/,"");
}

function gotMainFile(file) {

    var gotInput = false;
    if (file.type === 'text') {
        mainFile = file.data.split('\n');
        gotInput = true;
    } else if (file.type ===''){
        mainFile = atob(file.data.substring(13)).split('\n');
        gotInput = true;
    }

    if(gotInput){

        createP('Load Environment File:').parent('fileSelectDiv');
        var fileSelect = createFileInput(gotEnvFile); 
        fileSelect.parent('fileSelectDiv');

    }
}

function gotEnvFile(file) {
    
    var gotInput = false;
    if (file.type === 'text') {
        envFile = file.data.split('\n');
        gotInput = true;
    } else if (file.type ===''){
        envFile = atob(file.data.substring(13)).split('\n');
        gotInput = true;
    }

    if(gotInput){
        createP('Load Release File:').parent('fileSelectDiv');
        var fileSelect = createFileInput(gotRelFile); 
        fileSelect.parent('fileSelectDiv');
    }
}

function gotRelFile(file) {

    var gotInput = false;
    if (file.type === 'text') {
        relFile = file.data.split('\n');
        gotInput = true;
    } else if (file.type ===''){
        relFile = atob(file.data.substring(13)).split('\n');
        gotInput = true;
    }

    if(gotInput){
        createP('Load Interface File:').parent('fileSelectDiv');
        var fileSelect = createFileInput(gotIntFile); 
        fileSelect.parent('fileSelectDiv');
    }
}

function gotIntFile(file) {

    var gotInput = false;
    if (file.type === 'text') {
        intFile = file.data.split('\n');
        gotInput = true;
    } else if (file.type ===''){
        intFile = atob(file.data.substring(13)).split('\n');
        gotInput = true;
    }

    if(gotInput){
        generateCMDBvaluesMulti('hieraMultiNEW');
    }
}

function gotSingleFile(file) {

    var gotInput = false;
    if (file.type === 'text') {
        singleFile = file.data.split('\n');
        gotInput = true;
    } else if (file.type ===''){
        singleFile = atob(file.data.substring(13)).split('\n');
        gotInput = true;
    }

    if(gotInput){
        generateCMDBvalues(singleFile,'hieraSingleNEW');
    }
}