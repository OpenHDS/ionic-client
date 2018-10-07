import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/AuthService/auth.service";
import {LocationService} from "../../services/LocationService/location.service";
import {SocialGroupService} from "../../services/SocialGroupService/social-group.service";
import {CensusSubmissionService} from "../../services/CensusSubmissionService/census-submission.service";

@Component({
  selector: 'fieldworker-dash',
  templateUrl: './fieldworker-dash.page.html',
  styleUrls: ['./fieldworker-dash.page.scss'],
})
export class FieldworkerDashPage implements OnInit {
  readonly PAGE_NAME = "Fieldworker Dashboard";

  incompleteForms: Array<any> = [];
  constructor(public authProvider: AuthService,
              public locationService: LocationService, public socialGroupService: SocialGroupService,
              public censusIndividualService: CensusSubmissionService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FieldworkerModePage');
  }

  ngOnInit(){
    this.loadIncompleteForms()
  }

  async loadIncompleteForms(){
    await this.locationService.getAllLocations().then((data) => {
      data.forEach( entry => {
        if(entry.errorReported && entry.collectedBy.extId === this.authProvider.getLoggedInFieldworker().extId){
          this.incompleteForms.push(entry);
        }
      })
    });

    await this.socialGroupService.getAllSocialGroups().then((data) => {
      data.forEach( entry => {
        if(entry.errorReported && entry.collectedBy.extId === this.authProvider.getLoggedInFieldworker().extId){
          this.incompleteForms.push(entry);
        }
      })
    });

    await this.censusIndividualService.getAllCensusSubmissions().then((data) => {
      data.forEach( entry => {
        if(entry.errorReported && entry.collectedBy === this.authProvider.getLoggedInFieldworker().extId){
          this.incompleteForms.push(entry);
        }
      })
    });

    console.log(this.incompleteForms)
  }

}
