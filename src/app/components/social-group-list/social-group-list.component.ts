import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "../../services/Observable";
import {SocialGroup} from "../../models/social-group";
import {SocialGroupService} from "../../services/SocialGroupService/social-group.service";
import {SystemConfigService} from "../../services/SystemService/system-config.service";
import {Location} from "../../models/location";
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";

@Component({
  selector: 'social-group-list',
  templateUrl: './social-group-list.component.html',
  styleUrls: ['./social-group-list.component.scss']
})
export class SocialGroupListComponent implements OnInit {
  hierarchyLookupLevel;
  itemsPerPage = 7;
  selectedPage = 1;
  @Input() sgLocation: Location;
  @Input() collectedBy: string;
  socialGroups: SocialGroup[];
  @Output() selectedSg = new EventEmitter<SocialGroup>();
  selectedSGDisplay: SocialGroup;

  constructor(public syncObserver: SynchonizationObservableService, public sgProvider: SocialGroupService,
              public systemConfig: SystemConfigService) {
    this.syncObserver.subscribe("submitSG", (sg) => {
      console.log(sg.sg);
      this.sgProvider.loadInitData().then(async () => await this.getAllSocialGroups()).catch(err => console.log(err))
        .then(() =>
        {
          this.socialGroups = this.filterByLocationExtId();
          this.selectSocialGroup(sg.sg)
        });
    });

    this.syncObserver.subscribe('socialGroupSync', () => {
      this.sgProvider.loadInitData().then(async () => await this.getAllSocialGroups()).catch(err => console.log(err));
    });

    this.syncObserver.subscribe("socialGroups", async (sgs) => {
      this.socialGroups = sgs;
    });

    this.hierarchyLookupLevel = this.systemConfig.getSocialLookupLevel();
  }

  async ngOnInit() {
    await this.getAllSocialGroups().catch(err => console.log(err));
  }

  async getAllSocialGroups(){
    let sgs = await this.sgProvider.getAllSocialGroups();
    this.syncObserver.publishChange("socialGroups", sgs);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocialGroupsPage');
  }

  filterByLocationExtId(){
    if(this.socialGroups == null)
      return [];

    return this.socialGroups.filter(sg => sg.extId.substring(0, this.sgLocation.extId.length) == this.sgLocation.extId
      && this.sgLocation.locationLevel.level.keyIdentifier == this.hierarchyLookupLevel);
  }

  selectSocialGroup(socialGroup){
    if(this.selectedSGDisplay != null)
      this.socialGroups[this.socialGroups.indexOf(this.selectedSGDisplay)].selected = false;
    this.selectedSGDisplay = socialGroup;
    socialGroup.selected = true;
    this.selectedSg.emit(socialGroup);
  }

  moveUpLevel(){
    //Don't want to past 1st level in hierarchy
    if(this.hierarchyLookupLevel > 1) {
      this.hierarchyLookupLevel = this.hierarchyLookupLevel - 1;
      this.filterByLocationExtId();
    }
  }

  moveDownLevel(){
    //Don't want to past 1st level in hierarchy
    if(this.hierarchyLookupLevel < 5) {
      this.hierarchyLookupLevel = this.hierarchyLookupLevel + 1;
      this.filterByLocationExtId();
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
