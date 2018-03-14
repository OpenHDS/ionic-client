import { Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SystemConf} from "../../providers/system-config/system-config";

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
  configuration = SystemConf.getInstance();
  url: string;
  editing: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SystemConfigPage');
  }

  getUrl(){
    return this.configuration.getServerURL();
  }

  setEditing(){
    this.editing = !this.editing;
  }
}
