import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supervisor-dash',
  templateUrl: './supervisor-dash.page.html',
  styleUrls: ['./supervisor-dash.page.scss'],
})
export class SupervisorDashPage implements OnInit {
  readonly PAGE_NAME = "Supervisor Dashboard";

  constructor() { }

  ngOnInit() {
  }

}
