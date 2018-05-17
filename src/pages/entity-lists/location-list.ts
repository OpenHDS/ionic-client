import {Component, EventEmitter, OnInit, Input, Output} from '@angular/core';
import {IonicPage, Events, ModalController, NavController, NavParams} from 'ionic-angular';
import {Location} from "../../providers/locations/locations-db";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import { RefreshObservable } from "../../providers/RefreshObservable";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {CreateLocationPage} from "../create-entities/create-location";
import {Hierarchy} from "../../providers/location-hierarchies/hierarchy-db";

/**
 * Generated class for the LocationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'location-list',
  templateUrl: 'location-list.html',

})



export class LocationListPage {
  locationObserver: RefreshObservable = new RefreshObservable();
  locations: Location[];
  @Input() parentLevel: Hierarchy;
  @Output() selectedLoc = new EventEmitter<Location>();
  selectedLocation: Location;

  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public locProvider: LocationsProvider,
    public modalCtrl: ModalController, public networkConfig: NetworkConfigProvider) {

    this.locationObserver.subscribe(async (locations) => {
      this.locations = locations;
      console.log(this.locations)
    });

    this.ev.subscribe('submitLocation', () => {
      this.locProvider.initProvider().then(async () => await this.getAllLocations()).catch(err => console.log(err));
    });

    this.ev.subscribe('syncDb', () => {
      this.locProvider.initProvider().then(async () => await this.getAllLocations()).catch(err => console.log(err));
    });
  }

  async ngOnInit() {
    await this.getAllLocations().catch(err => console.log(err));

  }

  async getAllLocations() {
    let locations = await this.locProvider.getAllLocations();
    this.locationObserver.publishChange(locations);
  }

  async synchronize() {
    await this.locProvider.updateLocationsList()
      .then(() => this.getAllLocations())
      .then(() => this.locProvider.synchronizeOfflineLocations());
  }

  goToCreateLocPage(){
    this.navCtrl.push(CreateLocationPage, {parentLevel: this.parentLevel});
  }

  filterLocationsByParentLevel(){
    if(this.locations != null)
      return this.locations.filter(x => x.locationLevel.extId == this.parentLevel.extId);
  }

  selectLocation(location: Location){
    if(this.selectedLocation != null)
      this.locations[this.locations.indexOf(this.selectedLocation)].selected = false;
    this.selectedLocation = location;
    location.selected = true;
    this.selectedLoc.emit(location);
  }
}
