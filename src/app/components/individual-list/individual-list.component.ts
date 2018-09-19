import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RefreshObservable} from "../../services/RefreshObservable";
import {Individual} from "../../models/individual";
import {SocialGroup} from "../../models/social-group";
import {Events} from "@ionic/angular";
import {IndividualService} from "../../services/IndividualService/individual.service";

@Component({
  selector: 'individual-list',
  templateUrl: './individual-list.component.html',
  styleUrls: ['./individual-list.component.scss']
})
export class IndividualListComponent implements OnInit {
  itemsPerPage = 7;
  selectedPage = 1;

  indObserver: RefreshObservable = new RefreshObservable();
  @Input() sg: SocialGroup;
  @Input() loc: Location;
  @Input() collectedBy: string;
  @Output() selectedIndividual = new EventEmitter<Individual>();
  individuals: Individual[];

  constructor(public ev: Events, public indProvider: IndividualService) {
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
