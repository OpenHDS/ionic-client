import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

export class LocationFormControl extends FormControl {
  label: string;
  modelProperty: string;
  constructor(public translate: TranslateService, label: string, property: string, value: any, validator: any, disabled?: boolean) {
    super({value: value, disabled: disabled}, validator);
    this.label = label;
    this.modelProperty = property;
  }

  getValidationMessages() {
    const messages: any[] = [];
    if (this.errors) {
      for (const errorName in this.errors) {
        switch (errorName) {
          case 'required':
            this.translate.get('formRequiredPrompt', {value: this.label}).forEach(async x => messages.push(x));
            break;
          case 'pattern':
            let message = (`${this.label} contains illegal characters. Characters should be alphabetical or numeric.`);

            if(this.modelProperty === 'locationType') {
              message += ' Location Type should be RUR (Rural) or URB (Urban). Click the help (?) icon for more information.';
            }

            messages.push(message);
            break;
        }
      }
    }

    return messages;
  }
}

@Injectable()
export class LocationFormGroup extends FormGroup {
  formHelpMessages = {
    type: ['RUR - Rural', 'URB - Urban']
  };

  //Form group, fieldworker and locationLevel are auto-populated fields!
  constructor(public translate: TranslateService) {
    super({
      collectedBy: new LocationFormControl(translate, 'Fieldworker', 'collectedBy', '' , [], true),
      locationLevel: new LocationFormControl(translate, 'Subvillage', 'locationLevel', '', [], true),
      locationName: new LocationFormControl(translate,'Location Name', 'locationName', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      extId: new LocationFormControl(translate,'External Id', 'extId', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      locationType: new LocationFormControl(translate, 'Location Type', 'locationType', '',
        [Validators.compose([Validators.required,
          Validators.pattern('(URB|RUR)')])])
    });
  }

  get formControls(): LocationFormControl[] {
    return Object.keys(this.controls)
      .map(k => this.controls[k] as LocationFormControl);
  }

  getFormValidationMessages(form: any) : string[] {
    let messages: string[] = [];
    this.formControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));
    return messages;
  }

  getFormHelpMessage() {
    return this.formHelpMessages.type;
  }
}
