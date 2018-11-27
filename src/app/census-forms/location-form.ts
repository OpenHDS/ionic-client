import { FormControl, FormGroup, Validators } from '@angular/forms';

export class LocationFormControl extends FormControl {
  label: string;
  modelProperty: string;

  constructor(label: string, property: string, value: any, validator: any, disabled?: boolean) {
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
            messages.push(`You must enter a ${this.label}`);
            break;
          case 'pattern':
            let message = (`${this.label} contains illegal characters. Characters should be alphabetical or numeric.`);

            if(this.modelProperty === 'type') {
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

export class LocationFormGroup extends FormGroup {
  formHelpMessages = {
    type: ['RUR - Rural', 'URB - Urban']
  };

  //Form group, fieldworker and locationLevel are auto-populated fields!
  constructor() {
      super({
        collectedBy: new LocationFormControl('Fieldworker', 'collectedBy', '' , [], true),
        locationLevel: new LocationFormControl('Subvillage', 'locationLevel', '', [], true),
        locationName: new LocationFormControl('Location Name', 'locationName', '',
          [Validators.compose([Validators.required,
            Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
        extId: new LocationFormControl('External Id', 'extId', '',
          [Validators.compose([Validators.required,
            Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
        locationType: new LocationFormControl('Location Type', 'locationType', '',
          [Validators.compose([Validators.required,
            Validators.pattern('(URB|RUR)')])])
      });
  }

  get formControls(): LocationFormControl[] {
    return Object.keys(this.controls)
      .map(k => this.controls[k] as LocationFormControl);
  }

  getFormValidationMessages(form: any): string[] {
    const messages: string[] = [];
    this.formControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));

    console.log(messages);
    return messages;
  }

  getFormHelpMessage() {
    return this.formHelpMessages.type;
  }
}
