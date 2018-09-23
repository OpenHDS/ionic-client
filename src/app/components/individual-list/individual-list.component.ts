import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Individual} from "../../models/individual";
import {SocialGroup} from "../../models/social-group";
import {IndividualService} from "../../services/IndividualService/individual.service";
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";

@Component({
  selector: 'individual-list',
  templateUrl: './individual-list.component.html',
  styleUrls: ['./individual-list.component.scss']
})
export class IndividualListComponent implements OnInit {
  itemsPerPage = 7;
  selectedPage = 1;

  @Input() sg: SocialGroup;
  @Input() loc: Location;
  @Input() collectedBy: string;
  @Output() selectedIndividual = new EventEmitter<Individual>();
  individuals: Individual[];

  constructor(public syncObserver: SynchonizationObservableService, public indProvider: IndividualService) {
    this.syncObserver.subscribe("submitIndividual", async (ind) => {
      await this.getAllIndividuals().catch(err => console.log(err))
        .then(() =>
        {
          this.individuals = this.filterBySGExtId();
          this.selectIndividual(ind["ind"]);
        });
    });

    this.syncObserver.subscribe('syncIndividual', () => {
      console.log("Sync Individual Subscription...");
      this.indProvider.loadInitData().then(async () => await this.getAllIndividuals()).catch(err => console.log(err));
    });

    this.syncObserver.subscribe("individual", async (ind) => {
      this.individuals = ind;
    });
  }

  async ngOnInit() {
    await this.getAllIndividuals().catch(err => console.log(err));
  }

  async getAllIndividuals(){
    let ind = await this.indProvider.getAllIndividuals();
    this.syncObserver.publishChange("individual", ind);
  }

  filterBySGExtId(){
    if(this.individuals == null)
      return [];
    return this.individuals.filter(ind => ind.extId.startsWith(this.sg.extId));
  }

  selectIndividual(ind){
    this.selectedIndividual.emit(ind);
  }

  changePage(page) {
    this.selectedPage = page;
  }

  get pageCount(): number {
    if(this.individuals != undefined)
      return Math.ceil(this.individuals.length/this.itemsPerPage);

    return 0;
  }

  get individualDetails(): Individual[] {
    let pageIndex = (this.selectedPage - 1) * this.itemsPerPage;
    if(this.individuals != undefined)
      return this.individuals.slice(pageIndex, pageIndex + this.itemsPerPage);
    return [];
  }

}
