import {Component, Input, ViewChild, AfterViewInit} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { LocationListPage } from "../location-list/location-list";
import { Location } from "../../providers/locations/locations-db";
import {FieldworkerMenuPage} from "../fieldworker-menu/menu";

/**
 * Generated class for the BaselineCensusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'baseline-census',
  templateUrl: 'baseline-census.html',
})

export class BaselineCensusPage {
  locationEnabled: boolean = true;
  individualsEnabled: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuPopover: PopoverController) {

  }

  displayMenu(event){
    let popover = this.menuPopover.create(FieldworkerMenuPage);
    popover.present({
      ev: event
    });
  }
}
