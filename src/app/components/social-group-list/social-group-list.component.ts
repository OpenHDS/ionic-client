import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SocialGroup} from "../../models/social-group";
import {SocialGroupService} from "../../services/SocialGroupService/social-group.service";
import {SystemConfigService} from "../../services/SystemService/system-config.service";
import {Location} from "../../models/location";
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";
import {LocationHierarchyService} from "../../services/LocationHierarchyService/location-hierarchy.service";
import {HierarchyLevel} from "../../models/hierarchy-level";
import {Hierarchy} from "../../models/hierarchy";

@Component({
  selector: 'social-group-list',
  templateUrl: './social-group-list.component.html',
  styleUrls: ['./social-group-list.component.scss']
})
export class SocialGroupListComponent implements OnInit {
  hierarchyLookupLevel;
  levels: HierarchyLevel[] = [];
  itemsPerPage = 5;
  selectedPage = 1;
  @Input() sgHierarchy: Hierarchy[] //For moving up and down hierarchy
  @Input() sgLocation: Location;
  @Input() collectedBy: string;
  socialGroups: SocialGroup[];
  @Output() selectedSg = new EventEmitter<SocialGroup>();
  selectedSGDisplay: SocialGroup;

  changeHierarchyLevelOptions: any = {
    header: 'Change Hierarchy Level',
    subHeader: 'Select the hierarchy level to search for a social group',
    translucent: true
  };

  constructor(public syncObserver: SynchonizationObservableService, public locHierarchyService: LocationHierarchyService,
              public sgProvider: SocialGroupService,
              public systemConfig: SystemConfigService) {

    this.syncObserver.subscribe("SocialGroup:Create:ListUpdate", async () => {
       await this.getAllSocialGroups();
    });

    this.hierarchyLookupLevel = this.systemConfig.getSocialLookupLevel();
  }

  async ngOnInit() {
    await this.getAllSocialGroups();
    this.levels = await this.locHierarchyService.getLevels();
  }

  async getAllSocialGroups(){
    this.socialGroups = await this.sgProvider.filterSocialGroupsByLocation(this.sgLocation.extId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocialGroupsPage');
  }

  selectSocialGroup(socialGroup){
    if(this.selectedSGDisplay != null)
      this.socialGroups[this.socialGroups.indexOf(this.selectedSGDisplay)].selected = false;
    this.selectedSGDisplay = socialGroup;
    socialGroup.selected = true;
    this.selectedSg.emit(socialGroup);
  }

  async changeLevel(event){
    if(event.target.value === 1){
      this.socialGroups = await this.sgProvider.getAllSocialGroups();
    }

    else if(event.target.value === 5){
      await this.getAllSocialGroups();
    }

    else {
      this.socialGroups = await this.sgProvider.filterSocialGroupsByHierarchyLevel(event.target.value, this.sgHierarchy[event.target.value].extId)
    }
  }

  changePage(page) {
    this.selectedPage = page;
  }

  get pageCount(): number {
    if(this.socialGroups != undefined)
      return Math.ceil(this.socialGroups.length/this.itemsPerPage);

    return 0;
  }

  get socialGroupDetails(): SocialGroup[] {
    let pageIndex = (this.selectedPage - 1) * this.itemsPerPage;
    if(this.socialGroups != undefined)
      return this.socialGroups.slice(pageIndex, pageIndex + this.itemsPerPage);
    return [];
  }

}
