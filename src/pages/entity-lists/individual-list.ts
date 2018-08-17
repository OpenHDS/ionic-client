import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RefreshObservable} from "../../providers/RefreshObservable";
import {SocialGroup} from "../../model/social-groups";
import {Individual} from "../../model/individual";
import {CreateIndividualPage} from "../create-entities/create-individual";
import {IndividualProvider} from "../../providers/individual/individual";
import {Location} from "../../model/locations";

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
  @Input() loc: Location;
  @Output() selectedIndividual = new EventEmitter<Individual>();
  individuals: Individual[];

  constructor(public navCtrl: NavController, public ev: Events, public navParams: NavParams, public indProvider: IndividualProvider) {
    this.ev.subscribe("submitIndividual", async (ind) => {
     await this.getAllIndividuals().catch(err => console.log(err))
        .then(() =>
        {
          this.individuals = this.filterBySGExtId();
          this.selectIndividual(ind["ind"]);
        });
    });

    this.ev.subscribe('syncDb', () => {
      this.indProvider.loadInitData().then(async () => await this.getAllIndividuals()).catch(err => console.log(err));
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
    console.log("EMIT")
    this.selectedIndividual.emit(ind);
  }

  goToCreateIndividualPage(){
    this.navCtrl.push(CreateIndividualPage, {sg: this.sg, loc: this.loc});
  }
}
