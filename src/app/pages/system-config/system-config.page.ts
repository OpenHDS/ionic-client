import { Component, OnInit } from '@angular/core';
import {SystemConfigService} from "../../services/SystemService/system-config.service";

@Component({
  selector: 'system-config',
  templateUrl: './system-config.page.html',
  styleUrls: ['./system-config.page.scss'],
})
export class SystemConfigPage implements OnInit {
  readonly PAGE_NAME = 'System Configurations';
  url: string;
  hierarchyLevels: Object;
  codes: Object;
  showCodes: boolean;
  showHierarchy: boolean;
  showURL: boolean;
  editing: boolean;
  editingLH: boolean;
  editingCodes: boolean;

  constructor(public configuration: SystemConfigService) {
    this.setServerUrl();
    this.setHierarchy();
    this.setCodes();
  }

  ionViewWillEnter() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SystemConfigPage');
  }

  setServerUrl(){
    this.url = this.configuration.getServerURL();
  }

  setHierarchy(){
    this.hierarchyLevels = this.configuration.getLocationHierarchyConfig();
  }

  getHierarchyLevelKeys(){
    return Object.getOwnPropertyNames(this.hierarchyLevels)
  }

  setCodes(){
    this.codes = this.configuration.getSystemCodes();
  }

  getCodeKeys(){
    return Object.getOwnPropertyNames(this.codes);
  }

  saveServerUrl() {
    this.configuration.saveServerURL(this.url);
    this.editing = !this.editing;

  }

  setEditing(){
    //Possibility editing was canceled. Reset the text to display the original url.
    if(this.editing)
      this.url = this.configuration.getServerURL();

    this.editing = !this.editing;
  }

  setLHEditing(){
    if(this.editingLH)
      this.hierarchyLevels = this.configuration.getLocationHierarchyConfig();

    this.editingLH = !this.editingLH;
  }

  setCodeEditing(){
    if(this.editingCodes)
      this.codes = this.configuration.getSystemCodes();

    this.editingCodes = !this.editingCodes;
  }

  saveLocationHierarchy(){
    this.configuration.setLocationHierarchyConfig(this.hierarchyLevels);
    this.editingLH = !this.editingLH;
  }

  saveCodes(){
    this.configuration.saveSystemCodes(this.codes);
    this.editingCodes = !this.editingCodes;
  }

  displayCodes(){
    this.showCodes = !this.showCodes;
  }

  displayLH(){
    this.showHierarchy = !this.showHierarchy;
  }

  displayURL(){
    this.showURL = !this.showURL;
  }

  ngOnInit(): void {
  }


}
