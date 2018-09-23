import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Hierarchy} from "../../models/hierarchy";
import {NetworkConfigurationService} from "../../services/NetworkService/network-config";
import {LocationService} from "../../services/LocationService/location.service";
import {Router} from "@angular/router";
import {Location} from "../../models/location";
import {Events} from "@ionic/angular";
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";

@Component({
  selector: 'location-list',
  templateUrl: './location-list.page.html',
  styleUrls: ['./location-list.page.scss']
})
export class LocationListPage implements OnInit {
  itemsPerPage = 7;
  selectedPage = 1;

  locations: Location[] = [];
  @Input() parentLevel: Hierarchy;
  @Input() collectedBy: string;
  @Output() selectedLoc = new EventEmitter<Location>();

  constructor(public syncObserver: SynchonizationObservableService, public router: Router, public locProvider: LocationService,
              public networkConfig: NetworkConfigurationService) {



    this.syncObserver.subscribe("Location:Create:ListUpdate", async () => {
      this.getAllLocations().then(() => this.changePage(1));
      console.log(this.locations);
    });
  }

  async ngOnInit() {
    await this.getAllLocations().catch(err => console.log(err));
  }

  async getAllLocations() {
    this.locations = await this.locProvider.filterLocationsByParentLevel(this.parentLevel.extId);
  }

  selectLocation(location: Location) {
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

