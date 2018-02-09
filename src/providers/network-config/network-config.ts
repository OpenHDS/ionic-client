import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

/*
  Generated class for the NetworkConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkConfigProvider {
  connected: boolean = true;

  constructor(public http: HttpClient, public network: Network) {
    //Check if online when initially loaded. Uses navigator. Once checked Native Network plugin watches for changes.
    if(!navigator.onLine){
      this.connected = false;
      console.log("NAVIGATOR: offline")
    } else {
      console.log("NAVIGATOR: online");
    }
  }

  private connection = this.network.onConnect().subscribe(() => {
    this.connected = true;
    console.log("Network connection!");

  });

  private disconnected = this.network.onDisconnect().subscribe(() => {
    this.connected = false;
    console.log("No network connection!");
  });

  isConnected(): boolean {
    return this.connected;
  }
}
