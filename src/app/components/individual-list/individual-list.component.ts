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
  itemsPerPage = 5;
  selectedPage = 1;

  @Input() sg: SocialGroup;
  @Input() loc: Location;
  @Input() collectedBy: string;
  @Output() selectedIndividual = new EventEmitter<Individual>();
  individuals: Individual[];

  constructor(public syncObserver: SynchonizationObservableService, public indProvider: IndividualService) {
    this.syncObserver.subscribe("submitIndividual", async (ind) => {
          this.individuals = await this.filterBySGExtId();
          this.selectIndividual(ind["ind"]);
    });

    this.syncObserver.subscribe('Census:Reload:Individual', async () => {
      this.individuals = await this.filterBySGExtId();
    });

  }

  async ngOnInit() {
    this.individuals = await this.filterBySGExtId()
  }


  async filterBySGExtId(){
    let indByExtId = await this.indProvider.filterBySGExtId(this.sg.extId);
    if(indByExtId == null)
      return [];
    return indByExtId
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
