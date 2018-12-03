import { Component, OnInit } from '@angular/core';
import {NavigationService} from "../../services/NavigationService/navigation.service";
import {LocationService} from "../../services/LocationService/location.service";
import {SocialGroupService} from "../../services/SocialGroupService/social-group.service";
import {IndividualService} from "../../services/IndividualService/individual.service";
import {ErrorService} from "../../services/ErrorService/error-service";
import {NavController} from "@ionic/angular";
import {VisitService} from "../../services/VisitService/visit.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'entity-correction',
  templateUrl: './entity-correction.page.html',
  styleUrls: ['./entity-correction.page.scss'],
})

export class EntityCorrectionPage implements OnInit {
  readonly PAGE_NAME = 'Error Correction';
  readonly ENTITY_LABELS = ["Locations", "Social Groups", "Individuals", "Visits"];
  errors: any;
  errorKeys: any;
  selectedLabel = this.ENTITY_LABELS[0].toLowerCase();
  navigationSubscription;

  constructor(public router: Router, public navService: NavigationService, public errorService: ErrorService, public visitService: VisitService,
              public locationService: LocationService, public socialGroupService: SocialGroupService,
              public individualService: IndividualService, public navController: NavController) {

    // Reload page when clicked on from menu to remove data from when last loaded
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initializeCorrectionPage();
      }
    });
  }

  initializeCorrectionPage(){
    this.errors = undefined;
    this.errorKeys = undefined;
    this.selectedLabel = this.ENTITY_LABELS[0].toLowerCase();
    this.loadEntityErrors();
  }

  ngOnInit() {
    this.loadEntityErrors();
  }

  changeEntity(label){
    this.selectedLabel = label.toLowerCase();

    this.loadEntityErrors();
  }

  correctEntityError(entity){
    console.log(this.selectedLabel);
    switch(this.selectedLabel.replace(' ', '')){
      case 'locations':
        this.correctLocation(entity);
        break;
      case 'socialgroups':
        this.correctSocialGroup(entity);
        break;
      case 'individuals':
        this.correctIndividual(entity);
        break;
      case 'visits':
        this.correctVisit(entity);
    }
  }

  async getLocation(entityId){
    console.log(entityId);
    let hierarchy = await this.locationService.buildHierarchyForLocation(entityId);

    //Sort the hierarchy in descending order for baseline display
    hierarchy = hierarchy.sort((a, b) => {
      return a.level.keyIdentifier - b.level.keyIdentifier;
    });

    let l = await this.locationService.findLocationByExtId(entityId);

    return {selectedHierarchy: hierarchy, selectedLocation: l[0]}
  }

  async getSocialGroup(entityId){
    let sg = await this.socialGroupService.findSocialGroupByExtId(entityId);
    return sg[0];
  }

  async getIndividual(entityId){
    let individual = await this.individualService.findIndividualByExtId(entityId);
    return individual[0];
  }

  async getVisit(entityId){
    let visit = await this.visitService.getVisit(entityId);
    return visit[0];
  }

  async correctLocation(entityId){
    let locInfo = await this.getLocation(entityId);
    let entityErrMessages = this.errors[entityId];
    this.navService.data = {
      entityEditing: true,
      entity: 'locations',
      errors: entityErrMessages,
      selectedHierarchy: locInfo['selectedHierarchy'],
      selectedLocation: locInfo['selectedLocation']};
    this.navController.navigateForward("/baseline");
  }

  async correctSocialGroup(entityId){
    let socialGroupInfo = await this.getSocialGroup(entityId);
    let locInfo = await this.getLocation(entityId.substring(0, 9));
    let entityErrMessages = this.errors[entityId];

    this.navService.data = {
      entityEditing: true,
      entity: 'socialGroups',
      errors: entityErrMessages,
      selectedHierarchy: locInfo['selectedHierarchy'],
      selectedLocation: locInfo['selectedLocation'],
      selectedSocialGroup: socialGroupInfo
    };

    this.navController.navigateForward("/baseline");
  }

  async correctIndividual(entityId) {
    let individual = await this.getIndividual(entityId);
    let socialGroupInfo = await this.getSocialGroup(entityId.substring(0,11));
    let locInfo = await this.getLocation(entityId.substring(0, 9));
    let entityErrMessages = this.errors[entityId];


    this.navService.data = {
      entityEditing: true,
      entity: 'individuals',
      errors: entityErrMessages,
      selectedHierarchy: locInfo['selectedHierarchy'],
      selectedLocation: locInfo['selectedLocation'],
      selectedSocialGroup: socialGroupInfo,
      selectedIndividuals: [individual] //Baseline census page uses array of individuals
    };

    this.navController.navigateForward("/baseline");

  }

  async correctVisit(entityId){
    let entityErrMessages = this.errors[entityId];
    let locInfo = await this.getLocation(entityId.substring(0, 9));
    let socialGroupInfo = await this.getSocialGroup(entityId.substring(0,11));
    let visitInfo = await this.getVisit(entityId);

    this.navService.data = {
      entityEditing: true,
      entity: 'visits',
      errors: entityErrMessages,
      selectedHierarchy: locInfo['selectedHierarchy'],
      selectedLocation: locInfo['selectedLocation'],
      selectedSocialGroup: socialGroupInfo,
      selectedVisit: visitInfo

    };

    this.navController.navigateForward("/baseline");

  }

  async loadEntityErrors(){
      this.errors = await this.errorService.groupEntityErrorsByIds(this.selectedLabel.replace(" ", ""));
      this.errorKeys = Object.keys(this.errors);
  }

  convertTimestamp(date){
    return new Date(date).toDateString()
  }

}
