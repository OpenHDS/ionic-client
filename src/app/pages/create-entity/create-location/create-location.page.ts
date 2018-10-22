import {Component, OnInit, Output} from '@angular/core';
import {Events, LoadingController, ModalController, NavController} from "@ionic/angular";
import {LocationFormGroup} from "../../../census-forms/location-form";
import {Location} from "../../../models/location";
import {LocationService} from "../../../services/LocationService/location.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {NgForm} from "@angular/forms";
import {NetworkConfigurationService} from "../../../services/NetworkService/network-config";
import {HierarchyLevel} from "../../../models/hierarchy-level";
import {Fieldworker} from "../../../models/fieldworker";
import {NavigationService} from "../../../services/NavigationService/navigation.service";
import {HelpPopoverComponent} from "../../../components/help-popover/help-popover.component";
import {SynchonizationObservableService} from "../../../services/SynchonizationObserverable/synchonization-observable.service";

@Component({
  selector: 'create-location',
  templateUrl: './create-location.page.html',
  styleUrls: ['./create-location.page.scss'],
})
export class CreateLocationPage implements OnInit {
  readonly PAGE_NAME = "Create a Location";
  collectedBy: Fieldworker;
  parentLevel: HierarchyLevel;
  geoloc: boolean = false;
  formSubmitted: boolean = false;
  form: LocationFormGroup;

  @Output() loc: Location;
  //Default for a new location being created. Values will be set if a location is being fixed (due to errors that may have occurred).
  constructor(public syncObserver: SynchonizationObservableService, public navController: NavController,
              public navService: NavigationService,
              public loadingCtrl: LoadingController,
              public locProvider: LocationService, private geo: Geolocation,
              public netConfig: NetworkConfigurationService, public modalController: ModalController) {


    this.form = new LocationFormGroup();

    this.form.setValue({
      collectedBy: this.navService.data.collectedBy,
      locationLevel: this.navService.data.parentLevel,
      locationName: '',
      extId: '',
      locationType: ''
    });

    this.syncObserver.subscribe("Baseline:CreateLocation", () => {
      console.log("Baseline Census: Create a Location");
    })
  }

  ngOnInit(){

  }

  async getGeolocationInfo(loc){
    let loading = await this.loadingCtrl.create({
      message: "Gathering geolocation information..."
    });

    loading.present();

    this.geo.getCurrentPosition().then((resp) => {
      loc.latitude = resp.coords.latitude;
      loc.longitude = resp.coords.longitude;
      loc.altitude = resp.coords.altitude;
      loc.accuracy = resp.coords.altitudeAccuracy;
    }).catch(err => console.log(err)).then(() => {
      this.geoloc = true;
      loading.dismiss();
    });
  }

  async submitForm(form: NgForm){
    let loc: Location = new Location();

    this.formSubmitted = true;
    if(form.valid){
      Object.keys(form.value).forEach((key, index) => {
        loc[key] = form.value[key];
      });

      loc.locationLevel = this.navService.data.parentLevel;
      loc.collectedBy = this.navService.data.collectedBy;

      await this.locProvider.saveDataLocally(loc);
      this.formSubmitted = false;
      this.goBackToCensus(loc);
    }
  }

  async goBackToCensus(location: Location){
    this.syncObserver.publishChange("Location:Create:Success", location);
    this.syncObserver.publishChange("Location:Create:ListUpdate");
    this.navController.navigateBack("/baseline")
  }


  async helpPopup(labelName:string){
    let helpMessage = this.form.getFormHelpMessage();
    this.navService.data = {label: labelName, helpMessage: helpMessage};
    const modal = await this.modalController.create({
        component: HelpPopoverComponent
      });

    return await modal.present();
  }
}



