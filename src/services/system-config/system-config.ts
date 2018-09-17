import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ConfigLabels} from "./config-labels";
import {Platform} from "ionic-angular";

/*
  Generated class for the SystemConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on services
  and Angular DI.
*/

@Injectable()
export class SystemConfigProvider {
  private propertiesUrl: string;

  constructor(public http: HttpClient, public platform: Platform) {
    //Location of config file, dependent on device the application is running on.
    if(this.platform.is("ipad") || this.platform.is("tablet")){
      this.propertiesUrl = "../www/assets/resources/config.json"
    } else {
      this.propertiesUrl = "../../assets/resources/config.json"
    }

    if(localStorage.getItem("propertiesLoaded") != "Y")
      this.loadPropertiesFile();
  }

  private async loadPropertiesFile(){

    let properties = this.http.get(this.propertiesUrl).toPromise();
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


  getSocialLookupLevel(){
    return Number(localStorage.getItem("socialGroupLookupLevel"));
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
