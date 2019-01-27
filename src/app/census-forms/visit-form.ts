import { FormControl, FormGroup, Validators } from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";

export class VisitFormControl extends FormControl {
  label: string;
  modelProperty: string;

  constructor(public translate: TranslateService, label: string, property: string, value: any, validator: any, disabled?: boolean) {
    super({value: value, disabled: disabled}, validator);
    this.label = label;
    this.modelProperty = property;
  }

  getValidationMessages() {
    const messages: string[] = [];
    if (this.errors) {
      for (const errorName in this.errors) {
        switch (errorName) {
          case 'required':
            this.translate.get('formRequiredPrompt', {value: this.label}).forEach(async x => messages.push(x));
            break;
          case 'pattern':
            if(this.modelProperty === 'realVisit') {
              this.translate.get('realVisitError', {value: this.label}).forEach(async x => messages.push(x));
            } else {
              this.translate.get('formFieldPatternError', {value: this.label}).forEach(async x => messages.push(x));
            }
            break;
          case 'min':
            this.translate.get('visitRoundNumberError', {value: this.label}).forEach(async x => messages.push(x));
            break;
        }
      }
    }


    return messages;
  }
}

export class VisitFormGroup extends FormGroup {
  formHelpMessages = {
    'Real Visit': ['0 - Real', '1 - Empty House '],
  };

  // Form group, fieldworker and locationId are auto-populated fields!
  constructor(public translate: TranslateService) {
    super({
      collectedBy: new VisitFormControl(translate,'Fieldworker', 'collectedBy', '', [], true),
      visitLocation: new VisitFormControl(translate,'Location Id', 'visitLocation', '', [], true),
      roundNumber:  new VisitFormControl(translate,'Round Number', 'roundNumber', '',
        [], true),
      extId: new VisitFormControl(translate,'External Id', 'extId', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      visitDate: new VisitFormControl(translate,'Visit Date', 'visitDate', '',
        [Validators.compose([Validators.required])]),
      realVisit: new VisitFormControl(translate,'Real Visit', 'realVisit', '',
        [Validators.compose([Validators.required,
          Validators.pattern('(0|1)')])])
    });
  }

  get formControls(): VisitFormControl[] {
    return Object.keys(this.controls)
      .map(k => this.controls[k] as VisitFormControl);
  }

  getFormValidationMessages(form: any) : string[] {
    const messages: string[] = [];
    this.formControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));

    console.log(messages);
    return messages;
  }

  async getFormHelpMessage(label) {
    let helpMessages = undefined;
    await this.translate.get('visitFormHelpMessages').forEach(x => helpMessages = x);
    return helpMessages[label];
  }


}
