import { FormControl, FormGroup, Validators } from '@angular/forms';

export class VisitFormControl extends FormControl {
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
            let message = (`${this.label} contains illegal characters.`);

            if(this.modelProperty === 'realVisit') {
              message += ' A real visit should have the value of 0 or 1. Click on the help (?) button for more information.';
            }

            messages.push(message);
            break;
          case 'min':
            messages.push(`Round numbers can't be less than 0.` );
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
  constructor() {
    super({
      collectedBy: new VisitFormControl('Fieldworker', 'collectedBy', '', [], true),
      visitLocation: new VisitFormControl('Location Id', 'visitLocation', '', [], true),
      roundNumber:  new VisitFormControl('Round Number', 'roundNumber', '',
        [], true),
      extId: new VisitFormControl('External Id', 'extId', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      visitDate: new VisitFormControl('Visit Date', 'visitDate', '',
        [Validators.compose([Validators.required])]),
      realVisit: new VisitFormControl('Real Visit', 'realVisit', '',
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

  getFormHelpMessage(label) {
    return this.formHelpMessages[label];
  }


}
