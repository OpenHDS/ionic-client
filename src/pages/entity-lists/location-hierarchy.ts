import {Component, OnInit} from '@angular/core';
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

  hierarchy: Hierarchy[];
  levels: HierarchyLevels[];
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
        if (a.keyIdentifier < b.keyIdentifier)
          return a.keyIdentifier;
        else
          return b.keyIdentifier;
      }))).catch(err => console.log(err));

      this.lhProvider.getHierarchy().then(async (locHierarchy) => this.hierarchyObserver
        .publishChange(locHierarchy));
    });
  }

  async ngOnInit(){
    this.levels = await this.lhProvider.getLevels();
    this.levels = this.levels.sort((a, b) => {
      return a.keyIdentifier - b.keyIdentifier;
    });
    this.hierarchy = await this.lhProvider.getHierarchy();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationHierarchyPage');
  }

  getLevel1(){
    this.hierarchy.filter(x => x.level == this.levels[0])
  }

  getLevel2(){
    this.hierarchy.filter(x => x.level == this.levels[1])
  }

  getLevel3(){
    this.hierarchy.filter(x => x.level == this.levels[2])
  }

  getLevel4(){
    this.hierarchy.filter(x => x.level == this.levels[3])
  }

  getLevel5(){
    this.hierarchy.filter(x => x.level == this.levels[4])
  }
}
