import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SystemConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SystemConfigProvider {

  private conf = new Configurations();
  private testingFieldworker= "FWDW1";
  private testingLocLevel: string = "MBI";

  constructor(public http: HttpClient) {
    this.loadPropertiesFile();
  }

  private async loadPropertiesFile(){
    let properties = this.http.get("../../assets/resources/config.json").toPromise();
    let info = await properties;

    for(var prop in info){
      if(info.hasOwnProperty(prop)){
        this.conf[prop] = info[prop];
        console.log(prop)
      }
    }
  }

  getServerURL(){
    return this.conf.defaultURL;
  }

  getDefaultUser(){
    return this.conf.defaultUser;
  }

  getDefaultPassword(){
    return this.conf.defaultPassword;
  }

  getTestingFieldworker(){
    return this.testingFieldworker;
  }

   getTestingLocLevel(){
    return this.testingLocLevel;
  }

  getLocationHierarchyConfig(){
    return [this.conf.locationHierarchyLevel1, this.conf.locationHierarchyLevel2, this.conf.locationHierarchyLevel3,
      this.conf.locationHierarchyLevel4, this.conf.locationHierarchyLevel5, this.conf.locationHierarchyLevel6,
      this.conf.locationHierarchyLevel7,this.conf.locationHierarchyLevel8,this.conf.locationHierarchyLevel9]
  }
}

//Configurations class to hold all configuration variables.
class Configurations{
  defaultURL: string;
  defaultUser: string;
  defaultPassword: string;
  locationHierarchyLevel1: string;
  locationHierarchyLevel2: string;
  locationHierarchyLevel3: string;
  locationHierarchyLevel4: string;
  locationHierarchyLevel5: string;
  locationHierarchyLevel6: string;
  locationHierarchyLevel7: string;
  locationHierarchyLevel8: string;
  locationHierarchyLevel9: string;
}

