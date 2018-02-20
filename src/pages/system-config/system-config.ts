import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SystemConfigProvider } from "../../providers/system-config/system-config";

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
  editing: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public systemConfig: SystemConfigProvider) {
    this.getUrl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SystemConfigPage');
  }

  getUrl(){
    this.url = this.systemConfig.getServerURL();
  }

  setUrl(){
    this.systemConfig.setServerURL(this.url);
    this.setEditing();
  }

  setEditing(){
    this.editing = !this.editing;
  }
}
