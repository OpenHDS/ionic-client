import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File } from "@ionic-native/file";
import { FileError } from "@ionic-native/file";
import {ConfigLabels} from "./config-labels";
/*
  Generated class for the SystemConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class SystemConfigProvider {
  private testingFieldworker= "FWDW1";
  private testingLocLevel: string = "MBI";

  constructor(public http: HttpClient) {
    this.loadPropertiesFile();
  }

  private async loadPropertiesFile(){
    let properties = this.http.get("../../assets/resources/config.json").toPromise();
    let info = await properties;

    for(var prop in info){
        console.log(prop);
        localStorage.setItem(prop, info[prop]);
    }

    localStorage.setItem("propertiesLoaded", "Y");
  }

  getServerURL(){
    return localStorage.getItem("defaultURL");
  }

  getDefaultUser(){
    return localStorage.getItem("defaultUser");
  }

  getDefaultPassword(){
    return localStorage.getItem("defaultPassword");
  }

  getLocationHierarchyConfig() {
    var hierarchy = {};
    for (var level in ConfigLabels.LOC_HIERARCHY_CONFIG) {
      var lvl = ConfigLabels.LOC_HIERARCHY_CONFIG[level];
      var val = localStorage.getItem(lvl);
      if(val == "null")
        val = null;
      hierarchy[lvl] =  val;
    }

    return hierarchy;
  }

  setLocationHierarchyConfig(hierarchy){
    for (var level in ConfigLabels.LOC_HIERARCHY_CONFIG) {
      localStorage.setItem(ConfigLabels.LOC_HIERARCHY_CONFIG[level], hierarchy[ConfigLabels.LOC_HIERARCHY_CONFIG[level]]);
    }
  }

  getTestingFieldworker(){
    return this.testingFieldworker;
  }

  getTestingLocLevel(){
    return this.testingLocLevel;
  }

  saveServerURL(url){
    localStorage.setItem("defaultURL", url);
  }

  resetSystemConfigurations(){
    this.loadPropertiesFile();
  }

  getSystemCodes(){
    var codes = {};
    for(var code in ConfigLabels.CODES_PROPERTIES_CONFIG){
      codes[ConfigLabels.CODES_PROPERTIES_CONFIG[code]] =
        localStorage.getItem(ConfigLabels.CODES_PROPERTIES_CONFIG[code]);
    }

    return codes;
  }

  saveSystemCodes(codeProp){
    for (var code in ConfigLabels.CODES_PROPERTIES_CONFIG) {
      localStorage.setItem(ConfigLabels.CODES_PROPERTIES_CONFIG[code], codeProp[ConfigLabels.CODES_PROPERTIES_CONFIG[code]]);
    }
  }

  saveConfigToFile(){

    var keys = [];

    for(var i = 0; i < localStorage.length; i++){
      keys.push(localStorage.key(i));
    }

    var properties = {};

    keys.forEach((x) => {
      properties[x] = localStorage.getItem(x);
    });

    this.http.post("http://localhost:3000/saveConfig", properties);

    window.requestFileSystem(window.PERSISTENT, 2*1024*1024, (fs) => {
      fs.root.getFile("configuration.json", {create: true}, (file) => {
        file.createWriter((fileWriter) => {
          fileWriter.onwriteend = function (e) {
            console.log("Writing completed!")
          };

          fileWriter.onerror = function (e) {
            console.log("Writing failed ... " + e.toString())
          };

          var blob = new Blob([JSON.stringify(properties)], {type: 'application/json'});

          fileWriter.write(blob);

          console.log(file.toURL())

        }, err => console.log(err));
      }, err => console.log(err));
    });
  }

  errorHandler(e) {
    var msg = '';

    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    };

    console.log('Error: ' + msg);
  }

}
