import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RefreshObservable} from "../../services/RefreshObservable";
import {Hierarchy} from "../../models/hierarchy";
import {HierarchyLevel} from "../../models/hierarchy-level";
import {Events} from "@ionic/angular";
import {LocationHierarchyService} from "../../services/LocationHierarchyService/location-hierarchy.service";

@Component({
  selector: 'hierarchy-list',
  templateUrl: './hierarchy-list.component.html',
  styleUrls: ['./hierarchy-list.component.scss']
})
export class HierarchyListComponent implements OnInit {
  itemsPerPage = 7;
  selectedPage = 1;

  levelsObserver: RefreshObservable = new RefreshObservable();
  hierarchyObserver: RefreshObservable = new RefreshObservable();
  parent: Hierarchy;
  hierarchy: Hierarchy[] = [];
  levels: HierarchyLevel[] = [];

  @Output()
  selectedHierarchy = new EventEmitter<Hierarchy>();
  levelInHierarchy: number = 2;

  constructor( public ev: Events,
              public lhProvider: LocationHierarchyService) {

    this.levelsObserver.subscribe(async (levels) => {
      this.levels = levels;
    });

    this.hierarchyObserver.subscribe(async (hierarchy) => {
      this.hierarchy = hierarchy
    });

    this.ev.subscribe('syncDb', () => {
      this.lhProvider.getLevels().then(async (lvls) => this.levelsObserver.publishChange(lvls.sort((a,b) => {
        return a.keyIdentifier - b.keyIdentifier;
      }).filter(x => x.keyIdentifier > 1))).catch(err => console.log(err));

      this.lhProvider.getHierarchy().then(async (locHierarchy) =>
        this.hierarchyObserver.publishChange(locHierarchy));
    });


  }

  async ngOnInit(){
    this.levels = await this.lhProvider.getLevels();

    //Process and setup of location hierarchy
    this.levels = this.levels.sort((a, b) => {
      return a.keyIdentifier - b.keyIdentifier;
    }).filter(x => x.keyIdentifier > 1);
    this.hierarchy = await this.lhProvider.getHierarchy();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationHierarchyPage');
  }

  filterByLevel(keyLevel){
    if(keyLevel != 2)
      return this.hierarchy.filter(x => x.level.keyIdentifier == keyLevel && x.parent.extId == this.parent.extId);
    else
      return this.hierarchy.filter(x => x.level.keyIdentifier == keyLevel);
  }

  setSelectedLevel(levelInHierarchy, hier){
    //Set the value selected in the hierarchy as the parent to to filter next level for values associated
    this.parent = hier;
    this.selectedHierarchy.emit(hier);
    this.levelInHierarchy++;
  }

  getLevelCount(){
    return this.levels.length;
  }

  changePage(page) {
    this.selectedPage = page;
  }

  get pageCount(): number {
    if(this.hierarchy != undefined)
      return Math.ceil(this.hierarchy.length/this.itemsPerPage);

    return 0;
  }

  get locationDetails(): Hierarchy[] {
    let pageIndex = (this.selectedPage - 1) * this.itemsPerPage;
    if(this.hierarchy != undefined)
      return this.hierarchy.slice(pageIndex, pageIndex + this.itemsPerPage);
    return [];
  }

}
