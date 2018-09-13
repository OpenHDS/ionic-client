import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import {CensusSubmissionProvider} from "../../providers/census-submission/census-submission";
import {AuthProvider} from "../../providers/authentication/authentication";

/**
 * Generated class for the FieldworkerModePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fieldworker-mode',
  templateUrl: 'fieldworker-mode.html',
})
export class FieldworkerModePage implements OnInit {

  incompleteForms: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider,
              public locationProvider: LocationsProvider, public socialGroupsProvider: SocialGroupProvider,
              public censusIndividualsProvider: CensusSubmissionProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FieldworkerModePage');
  }

  ngOnInit(){
    this.loadIncompleteForms()
  }

  async loadIncompleteForms(){
    await this.locationProvider.getAllLocations().then((data) => {
      data.forEach( entry => {
        if(entry.errorReported && entry.collectedBy == this.authProvider.getLoggedInFieldworker().extId){
          this.incompleteForms.push(entry);
        }
      })
    });

    await this.socialGroupsProvider.getAllSocialGroups().then((data) => {
      data.forEach( entry => {
        if(entry.errorReported && entry.collectedBy == this.authProvider.getLoggedInFieldworker().extId){
          this.incompleteForms.push(entry);
        }
      })
    });

    await this.censusIndividualsProvider.getAllCensusSubmissions().then((data) => {
      data.forEach( entry => {
        if(entry.errorReported && entry.collectedBy == this.authProvider.getLoggedInFieldworker().extId){
          this.incompleteForms.push(entry);
        }
      })
    });
  }

}
