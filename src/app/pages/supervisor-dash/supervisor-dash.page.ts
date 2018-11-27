import { Component, OnInit } from '@angular/core';
import {Events} from "@ionic/angular";
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";

@Component({
  selector: 'supervisor-dash',
  templateUrl: './supervisor-dash.page.html',
  styleUrls: ['./supervisor-dash.page.scss'],
})
export class SupervisorDashPage implements OnInit {
  readonly PAGE_NAME = "Supervisor Dashboard";

  constructor(public events: Events, public syncObserver: SynchonizationObservableService) {
    this.syncObserver.subscribe("Login:Admin:Success", () => {
      console.log("Successful login. Sent to Supervisor Dashboard...")
    });
  }

  ngOnInit() {
  }

}
