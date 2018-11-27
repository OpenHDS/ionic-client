import { FormControl, FormGroup, Validators } from '@angular/forms';

export class SocialGroupFormControl extends FormControl {
  label: string;
  modelProperty: string;

  constructor(label:string, property:string, value: any, validator: any, disabled?: boolean) {
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

            if(this.modelProperty === 'extId' || this.modelProperty === 'groupName') {
              message += ' Characters should be alphabetic or numeric.';
            } else if(this.modelProperty === 'groupType') {
              message += ' Possible values include FAM (Family) or COH (Cohort).';
            }

            messages.push(message);
            break;
        }
      }
    }

    return messages;
  }
}

export class SocialGroupFormGroup extends FormGroup {
  formHelpMessages = {
    type: ['COH - Cohort', 'FAM - Family']
  };

  // Form group, fieldworker and locationId are auto-populated fields!
  constructor() {
    super({
      collectedBy: new SocialGroupFormControl('Fieldworker', 'collectedBy', '' , [], true),
      extId: new SocialGroupFormControl('External Id', 'extId', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      groupName: new SocialGroupFormControl('Group Name', 'groupName', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      groupType: new SocialGroupFormControl('Group Type', 'groupType', '',
        [Validators.compose([Validators.required,
          Validators.pattern('(FAM|COH)')])])
    });
  }

  get formControls(): SocialGroupFormControl[] {
    return Object.keys(this.controls)
      .map(k => this.controls[k] as SocialGroupFormControl);
  }

  getFormValidationMessages(form: any): string[] {
    const messages: string[] = [];
    this.formControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));
    return messages;
  }

  getFormHelpMessage(formLabel){
    return this.formHelpMessages.type;
  }
}

