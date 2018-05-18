import {Component, EventEmitter, Input, Output} from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import {RefreshObservable} from "../../providers/RefreshObservable";
import {SocialGroup} from "../../interfaces/social-groups";
import {Location} from "../../interfaces/locations";
import {CreateSocialGroupPage} from "../create-entities/create-sg";

/**
 * Generated class for the SocialGroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'social-groups',
  templateUrl: 'social-groups.html',
})
export class SocialGroupsPage {
  sgObserver: RefreshObservable = new RefreshObservable();
  @Input() sgLocation: Location;
  socialGroups: SocialGroup[];
  @Output() selectedSg = new EventEmitter<SocialGroup>();
  selectedSGDisplay: SocialGroup;

  constructor(public navCtrl: NavController, public ev: Events, public navParams: NavParams, public sgProvider: SocialGroupProvider) {
    this.ev.subscribe("submitSG", (sg) => {
      console.log(sg.sg);
      this.sgProvider.initProvider().then(async () => await this.getAllSocialGroups()).catch(err => console.log(err))
        .then(() =>
          {
            this.socialGroups = this.filterByLocationExtId();
            this.selectSocialGroup(sg.sg)
          });
    });

    this.ev.subscribe('syncDb', () => {
      this.sgProvider.initProvider().then(async () => await this.getAllSocialGroups()).catch(err => console.log(err));
    });

    this.sgObserver.subscribe(async (sgs) => {
      this.socialGroups = sgs;
    });
  }

  async ngOnInit() {
    await this.getAllSocialGroups().catch(err => console.log(err));
  }

  async getAllSocialGroups(){
    let sgs = await this.sgProvider.getAllSocialGroups();
    this.sgObserver.publishChange(sgs);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocialGroupsPage');
  }

  filterByLocationExtId(){
    if(this.socialGroups == null)
      return [];

    return this.socialGroups.filter(sg => sg.extId.substring(0, this.sgLocation.extId.length) == this.sgLocation.extId);
  }

  selectSocialGroup(socialGroup){
    if(this.selectedSGDisplay != null)
      this.socialGroups[this.socialGroups.indexOf(this.selectedSGDisplay)].selected = false;
    this.selectedSGDisplay = socialGroup;
    socialGroup.selected = true;
    this.selectedSg.emit(socialGroup);
  }

  goToCreateSgPage(){
    this.navCtrl.push(CreateSocialGroupPage, {sgLocation: this.sgLocation});
  }
}
