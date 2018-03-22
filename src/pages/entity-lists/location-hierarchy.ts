import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {LocationHierarchiesProvider} from "../../providers/location-hierarchies/location-hierarchies";
import {HierarchyLevels} from "../../providers/location-hierarchies/hierarchy-levels-db";
import {Hierarchy} from "../../providers/location-hierarchies/hierarchy-db";
import {RefreshObservable} from "../../providers/RefreshObservable";

/**
 * Generated class for the LocationHierarchyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'location-hierarchy',
  templateUrl: 'location-hierarchy.html',
})

export class LocationHierarchyPage implements OnInit{
  levelsObserver: RefreshObservable = new RefreshObservable();
  hierarchyObserver: RefreshObservable = new RefreshObservable();
  hierarchy: Hierarchy[] = [];
  levels: HierarchyLevels[] = [];

  @Output()
  selectedHierarchy = new EventEmitter<Hierarchy>();
  levelInHierarchy: number = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ev: Events,
              public lhProvider: LocationHierarchiesProvider) {

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
      return this.hierarchy.filter(x => x.level.keyIdentifier == keyLevel)
  }

  setSelectedLevel(levelInHierarchy, hier){
    this.selectedHierarchy.emit(hier);
    this.levelInHierarchy++;
  }

  getLevelCount(){
    return this.levels.length;
  }

}
