import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RefreshObservable} from "../../providers/RefreshObservable";
import {SocialGroup} from "../../providers/social-group/socialGroup-db";
import {Individual} from "../../providers/individual/individual-db";
import {CreateIndividualPage} from "../create-entities/create-individual";
import {IndividualProvider} from "../../providers/individual/individual";

/**
 * Generated class for the IndividualListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'individual-list',
  templateUrl: 'individual-list.html',
})

export class IndividualListPage {
  indObserver: RefreshObservable = new RefreshObservable();
  @Input() sg: SocialGroup;
  @Output() selectedIndividual = new EventEmitter<Individual>();
  selectedIndDisplay: Individual;
  individuals: Individual[];

  constructor(public navCtrl: NavController, public ev: Events, public navParams: NavParams, public indProvider: IndividualProvider) {
    this.ev.subscribe("submitInd", (ind) => {
      this.indProvider.initProvider().then(async () => await this.getAllIndividuals()).catch(err => console.log(err))
        .then(() =>
        {
          this.individuals = this.filterBySGExtId();
          this.selectIndividual(ind.ind);
        });
    });

    this.ev.subscribe('syncDb', () => {
      this.indProvider.initProvider().then(async () => await this.getAllIndividuals()).catch(err => console.log(err));
    });

    this.indObserver.subscribe(async (ind) => {
      this.individuals = ind;
    });
  }

  async ngOnInit() {
    await this.getAllIndividuals().catch(err => console.log(err));
  }

  async getAllIndividuals(){
    let ind = await this.indProvider.getAllIndividuals();
    this.indObserver.publishChange(ind);
  }

  filterBySGExtId(){
    if(this.individuals == null)
      return [];
    return this.individuals.filter(ind => ind.extId.startsWith(this.sg.extId));
  }

  selectIndividual(ind){
    if(this.selectedIndDisplay != null)
      this.individuals[this.individuals.indexOf(this.selectedIndDisplay)].selected = false;
    this.selectedIndDisplay = ind;
    ind.selected = true;
    this.selectedIndividual.emit(ind);
  }

  goToCreateIndividualPage(){
   this.navCtrl.push(CreateIndividualPage, {sg: this.sg});
  }
}
