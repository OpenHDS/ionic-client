// Common Header for all html files, header title is provided as param.
import {Component, Input} from "@angular/core";

@Component({
  selector: 'openhds-header',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>{{this.headerTitle}}</ion-title>
      </ion-toolbar>
    </ion-header>
  `,

})
export class OpenhdsTitleHeaderComponent {
  @Input() headerTitle: string;
}

