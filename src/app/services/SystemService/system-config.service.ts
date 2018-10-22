import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ConfigLabels} from './config-labels';
import {Platform} from '@ionic/angular';

/*
  Generated class for the SystemConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable({
    providedIn: 'root',
})
export class SystemConfigService {
  private propertiesUrl: string;

  constructor(public http: HttpClient, public platform: Platform) {
    // Location of config file, dependent on device the application is running on.
    if (this.platform.is('ipad') || this.platform.is('tablet')) {
      this.propertiesUrl = '../www/assets/resources/config.json';
    } else {
      this.propertiesUrl = '../../assets/resources/config.json';
    }

    if (localStorage.getItem('propertiesLoaded') !== 'Y') {
      this.loadPropertiesFile();
    }
  }

  private async loadPropertiesFile() {

    const properties = this.http.get(this.propertiesUrl).toPromise();
    const info = await properties;

    for (const prop in info) {
      console.log(prop);
      localStorage.setItem(prop, info[prop]);
    }

    localStorage.setItem('propertiesLoaded', 'Y');
  }

  getServerURL() {
    return localStorage.getItem('defaultURL');
  }

  getDefaultUser() {
    return localStorage.getItem('defaultUser');
  }

  getDefaultPassword() {
    return localStorage.getItem('defaultPassword');
  }

  getLocationHierarchyConfig() {
    const hierarchy = {};
    for (const level in ConfigLabels.LOC_HIERARCHY_CONFIG) {
      const lvl = ConfigLabels.LOC_HIERARCHY_CONFIG[level];
      let val = localStorage.getItem(lvl);
      if (val === 'null') {
        val = null;
      }
      hierarchy[lvl] =  val;
    }

    return hierarchy;
  }

  setLocationHierarchyConfig(hierarchy) {
    for (const level in ConfigLabels.LOC_HIERARCHY_CONFIG) {
      localStorage.setItem(ConfigLabels.LOC_HIERARCHY_CONFIG[level], hierarchy[ConfigLabels.LOC_HIERARCHY_CONFIG[level]]);
    }
  }


  getSocialLookupLevel() {
    return Number(localStorage.getItem('socialGroupLookupLevel'));
  }

  saveServerURL(url) {
    localStorage.setItem('defaultURL', url);
  }

  resetSystemConfigurations() {
    this.loadPropertiesFile();
  }

  getSystemCodes() {
    const codes = {};
    for (const code in ConfigLabels.CODES_PROPERTIES_CONFIG) {
      codes[ConfigLabels.CODES_PROPERTIES_CONFIG[code]] =
        localStorage.getItem(ConfigLabels.CODES_PROPERTIES_CONFIG[code]);
    }

    return codes;
  }

  saveSystemCodes(codeProp) {
    for (const code in ConfigLabels.CODES_PROPERTIES_CONFIG) {
      localStorage.setItem(ConfigLabels.CODES_PROPERTIES_CONFIG[code], codeProp[ConfigLabels.CODES_PROPERTIES_CONFIG[code]]);
    }
  }

  getLocationHierarchyLevelNames() {
    const hierarchy = [];
    for (const level in ConfigLabels.LOC_HIERARCHY_CONFIG) {
      const lvl = ConfigLabels.LOC_HIERARCHY_CONFIG[level];
      const val = localStorage.getItem(lvl);
      if (val !== 'null' && val !== 'Country') {
        hierarchy.push(val);
      }
    }

    return hierarchy;
  }

}
