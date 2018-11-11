import { Component, OnInit } from '@angular/core';
import {NavigationService} from "../../services/NavigationService/navigation.service";
import {LocationService} from "../../services/LocationService/location.service";
import {SocialGroupService} from "../../services/SocialGroupService/social-group.service";
import {IndividualService} from "../../services/IndividualService/individual.service";
import {ErrorService} from "../../services/ErrorService/error-service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'entity-correction',
  templateUrl: './entity-correction.page.html',
  styleUrls: ['./entity-correction.page.scss'],
})

export class EntityCorrectionPage implements OnInit {
  readonly PAGE_NAME = 'Error Correction';
  readonly ENTITY_LABELS = ["Locations", "Social Groups", "Individuals", "Visits"];
  errors = [];
  selectedLabel = this.ENTITY_LABELS[0].toLowerCase();

  constructor(public navService: NavigationService, public errorService: ErrorService,
              public locationService: LocationService, public socialGroupService: SocialGroupService,
              public individualService: IndividualService, public navController: NavController) {}

  ngOnInit() {
    this.loadEntityErrors();
  }

  changeEntity(label){
    this.selectedLabel = label.toLowerCase();

    this.loadEntityErrors();
  }

  correctEntityError(entity){
    switch(entity.entityType){
      case 'locations':
        this.correctLocation(entity.entityExtId);
        break;
      case 'socialgroups':
        this.correctSocialGroup(entity.entityExtId);
        break;
      case 'individuals':
        this.correctIndividual(entity.entityExtId);
        break;
    }
  }

  async getLocation(entityId){
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

  async correctLocation(entityId){
    let locInfo = await this.getLocation(entityId);
    let entityErrMessages = this.errors.filter(x => x.entityExtId === entityId);
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

    this.navService.data ={
      entityEditing: true,
      entity: 'socialGroups',
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

    this.navService.data ={
      entityEditing: true,
      entity: 'individuals',
      selectedHierarchy: locInfo['selectedHierarchy'],
      selectedLocation: locInfo['selectedLocation'],
      selectedSocialGroup: socialGroupInfo,
      selectedIndividuals: [individual] //Baseline census page uses array of individuals
    };

    this.navController.navigateForward("/baseline");

  }

  async loadEntityErrors(){
      this.errors = await this.errorService.getEntityErrors(this.selectedLabel.replace(" ", ""));
  }

  convertTimestamp(date){
    return new Date(date).toDateString()
  }

}
