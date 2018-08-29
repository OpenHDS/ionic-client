import {Component, EventEmitter, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Fieldworker} from "../../../model/fieldworker";
import {FieldworkerProvider} from "../../../providers/fieldworker/fieldworker";

/**
 * Generated class for the DropdownSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'fw-dropdown-search',
  templateUrl: 'dropdown-search.html',
})
export class DropdownSearchPage implements OnInit {

  fieldworkerList: Fieldworker[];
  filtered: Fieldworker[] = [];
  fieldworker_extId: EventEmitter<Fieldworker> = new EventEmitter<Fieldworker>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public fieldworkerProvider: FieldworkerProvider) {

  }

  async ngOnInit(){
    this.fieldworkerList = await this.fieldworkerProvider.getAllFieldworkers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DropdownSearchPage');
  }

  search(phrase){
    console.log(phrase.value.toString());
    this.filtered = this.fieldworkerList.filter(x => x.extId.indexOf(phrase.value.toString()) > -1);
  }

  emitFieldworker(fw){
    this.fieldworker_extId.emit(fw);
  }


}
