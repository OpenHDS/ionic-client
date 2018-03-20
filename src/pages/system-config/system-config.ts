import { Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SystemConfigProvider} from "../../providers/system-config/system-config";

/**
 * Generated class for the SystemConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-system-config',
  templateUrl: 'system-config.html',
})

export class SystemConfigPage {
  url: string;
  hierarchyLevels: Object;
  codes: Object;
  showCodes: boolean;
  showHierarchy: boolean;
  showURL: boolean;
  editing: boolean;
  editingLH: boolean;
  editingCodes: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public configuration: SystemConfigProvider) {
    this.setServerUrl();
    this.setHierarchy();
    this.setCodes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SystemConfigPage');
  }

  setServerUrl(){
    this.url = this.configuration.getServerURL();
  }


  setHierarchy(){
    this.hierarchyLevels = this.configuration.getLocationHierarchyConfig();
  }

  getHierarchyLevelKeys(){
    return Object.getOwnPropertyNames(this.hierarchyLevels)
  }

  setCodes(){
    this.codes = this.configuration.getSystemCodes();
  }

  getCodeKeys(){
    return Object.getOwnPropertyNames(this.codes);
  }

  saveServerUrl(){
    this.configuration.saveServerURL(this.url);
    this.editing = !this.editing;

  setUrl(){
    this.systemConfig.setServerURL(this.url);
    this.setEditing();
  }

  setEditing(){
    //Possibility editing was canceled. Reset the text to display the original url.
    if(this.editing)
      this.url = this.configuration.getServerURL();

    this.editing = !this.editing;
  }

  setLHEditing(){
    if(this.editingLH)
      this.hierarchyLevels = this.configuration.getLocationHierarchyConfig();

    this.editingLH = !this.editingLH;
  }

  setCodeEditing(){
    if(this.editingCodes)
      this.codes = this.configuration.getSystemCodes();

    this.editingCodes = !this.editingCodes;
  }

  saveLocationHierarchy(){
    this.configuration.setLocationHierarchyConfig(this.hierarchyLevels);
    this.editingLH = !this.editingLH;
  }

  saveCodes(){
    this.configuration.saveSystemCodes(this.codes);
    this.editingCodes = !this.editingCodes;
  }

  displayCodes(){
    this.showCodes = !this.showCodes;
  }

  displayLH(){
    this.showHierarchy = !this.showHierarchy;
  }

  displayURL(){
    this.showURL = !this.showURL;
  }
}
