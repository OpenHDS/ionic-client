import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File } from "@ionic-native/file";
import { FileError } from "@ionic-native/file";
import {ConfigLabels} from "./config-labels";
import {FilePath} from "@ionic-native/file-path";

/*
  Generated class for the SystemConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class SystemConfigProvider {
  private testingFieldworker= "FWDW1";
  private testingLocLevel: string = "MBI";
  private url: string;
  constructor(public http: HttpClient, private filepath: FilePath) {
    this.loadPropertiesFile();
  }

  private async loadPropertiesFile(){

    let properties = this.http.get("../www/assets/resources/config.json").toPromise();
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

  getLocationHierarchyLevelNames(){
    var hierarchy = [];
    for (var level in ConfigLabels.LOC_HIERARCHY_CONFIG) {
      var lvl = ConfigLabels.LOC_HIERARCHY_CONFIG[level];
      var val = localStorage.getItem(lvl);
      if(val != "null" && val != "Country")
        hierarchy.push(val);
    }

    return hierarchy;
  }

}
