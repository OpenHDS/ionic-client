import { HttpClient } from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';

/*
  Generated class for the SystemConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class SystemConfigProvider {
  private default_url = 'http://localhost:8080/openhds/api2/rest/';
  private server_url = null;

  constructor(){

  }

  init(){
    console.log("NgOnInit: Server Configurations");
    if(localStorage.getItem('server_url') == null) {
      localStorage.setItem('server_url', this.default_url);
      this.server_url = this.default_url;
    } else {
      this.server_url = localStorage.getItem('server_url');
    }
  }

  getServerURL(){
    if(this.server_url == null)
      this.init();

    return this.server_url;
  }

  setServerURL(url: string){
    this.server_url = url;

    localStorage.setItem('server_url', this.server_url);
  }

  resetServerUrl(){
    this.server_url = this.default_url;
    localStorage.setItem('server_url', this.default_url);
  }
}
