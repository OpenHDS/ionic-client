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
  hierarchyLevels: any;
  codes: any;
  showCodes: boolean = false;
  showHierarchy: boolean = false;
  showURL: boolean = false
  editing: boolean;

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

  setCodes(){
    this.codes = this.configuration.getSystemCodes();
  }

  saveServerUrl(){
    this.configuration.saveServerURL(this.url);
    this.setEditing();
  }

  setEditing(){
    this.editing = !this.editing;
  }

  saveLocationHierarchy(){

  }
}
