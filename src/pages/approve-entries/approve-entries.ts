import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {IndividualProvider} from "../../providers/individual/individual";
import {Individual} from "../../interfaces/individual";
import {CensusSubmissionProvider} from "../../providers/census-submission/census-submission";
import {CensusIndividual} from "../../interfaces/census-individual";

/**
 * Generated class for the ApproveEntriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-approve-entries',
  templateUrl: 'approve-entries.html',
})
export class ApproveEntriesPage{
  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController, public indProvider: IndividualProvider,
              public censusSub: CensusSubmissionProvider) {
    // this.loadIndividuals();
  }

  needApproval: Array<CensusIndividual> = [];
  selectedForReview: string = "locations";

  ionViewWillEnter() {
    this.view.showBackButton(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveEntriesPage');
  }

  async loadIndividuals(){
    this.needApproval = await this.censusSub.getAllCensusSubmissions();
    console.log(this.needApproval);
  }

  approveAndSend(ind){
    this.censusSub.sendCensusIndividual(ind);
  }

  setSelectedForReview(selected){
    this.selectedForReview = selected
  }



}
