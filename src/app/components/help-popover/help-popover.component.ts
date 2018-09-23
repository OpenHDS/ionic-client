import { Component } from '@angular/core';
import {NavigationService} from "../../services/NavigationService/navigation.service";

@Component({
  selector: 'help-popover',
  templateUrl: './help-popover.component.html',
  styleUrls: ['./help-popover.component.scss']
})

export class HelpPopoverComponent{
  label: string;
  helpMessage;
  constructor(public navService: NavigationService){
    this.label = this.navService.data.label;
    this.helpMessage = this.navService.data.helpMessage;
  }
}
