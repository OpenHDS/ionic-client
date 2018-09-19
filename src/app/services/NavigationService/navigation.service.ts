import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//Navigation service similar to NavParams in Ionic 3 for passing parameters between components
export class NavigationService {
  private _data: any;
  constructor() { }

  set data(params){
    this._data = params;
  }

  get data(){
    const temp = this._data;
    return temp;
  }
}
