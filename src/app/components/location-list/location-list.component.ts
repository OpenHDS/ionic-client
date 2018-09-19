import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RefreshObservable} from "../../services/RefreshObservable";
import {Hierarchy} from "../../models/hierarchy";
import {Events} from "@ionic/angular";
import {NetworkConfigurationService} from "../../services/NetworkService/network-config";
import {LocationService} from "../../services/LocationService/location.service";
import {Router} from "@angular/router";
import {Location} from "../../models/location";

@Component({
  selector: 'location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {
  itemsPerPage = 7;
  selectedPage = 1;

  locationObserver: RefreshObservable = new RefreshObservable();
  locations: Location[];
  @Input() parentLevel: Hierarchy;
  @Input() collectedBy: string;
  @Output() selectedLoc = new EventEmitter<Location>();
  selectedLocation: Location;

  constructor(public ev: Events, public router: Router, public locProvider: LocationService,
              public networkConfig: NetworkConfigurationService) {

    this.locationObserver.subscribe(async (locations) => {
      this.locations = locations;
    });

    this.ev.subscribe('syncDb', () => {
      this.locProvider.loadInitData().then(async () => await this.getAllLocations())
        .catch(err => console.log(err));
    });
  }

  async ngOnInit() {
    await this.getAllLocations().catch(err => console.log(err));
  }

  async getAllLocations() {
    let locations = await this.locProvider.filterLocationsByParentLevel(this.parentLevel.extId);
    this.locationObserver.publishChange(locations);
  }

  selectLocation(location: Location) {
    if (this.selectedLocation != null)
      this.locations[this.locations.indexOf(this.selectedLocation)].selected = false;
    this.selectedLocation = location;
    location.selected = true;
    this.selectedLoc.emit(location);
  }

  changePage(page) {
    this.selectedPage = page;
  }

  get pageCount(): number {
    if(this.locations != undefined)
      return Math.ceil(this.locations.length/this.itemsPerPage);

    return 0;
  }

  get locationDetails(): Location[] {
    let pageIndex = (this.selectedPage - 1) * this.itemsPerPage;
    if(this.locations != undefined)
      return this.locations.slice(pageIndex, pageIndex + this.itemsPerPage);
    return [];
  }

}

