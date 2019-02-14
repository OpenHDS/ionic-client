import { FormControl, FormGroup, Validators } from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";

export class IndividualFormControl extends FormControl {
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
            // Add custom message to the default based on property.
            if(this.modelProperty === 'gender'){
              this.translate.get('individualGenderFormError', {value: this.label}).forEach(async x => messages.push(x));
            } else{
              this.translate.get('formFieldPatternError', {value: this.label}).forEach(async x => messages.push(x));
            }

            break;
        }
      }
    }
    return messages;
  }
}

export class IndividualFormGroup extends FormGroup {
  formHelpMessages = {
    'Gender': ['F - Female', 'M - Male'],
    'Partial Date': ['1 - Exact', '2 - Approximate']
  };

  // Form group, fieldworker and socialId are auto-populated fields!
  constructor(public translate: TranslateService) {
    super({
      collectedBy: new IndividualFormControl(translate,'Fieldworker', 'collectedBy', '' ,
          Validators.compose([]), true),
      extId: new IndividualFormControl(translate,'External Id', 'extId', '',
       [Validators.compose([Validators.required,
         Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      firstName: new IndividualFormControl(translate,'First Name', 'firstName', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      middleName: new IndividualFormControl(translate,'Middle Name', 'middleName', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      lastName: new IndividualFormControl(translate,'Last Name', 'lastName', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      gender: new IndividualFormControl(translate,'Gender', 'gender', '',
        [Validators.compose([Validators.required,
          Validators.pattern('(M|F)')])]),
      dob: new IndividualFormControl(translate,'Date of Birth', 'dob', '',
        []),
      dobAspect: new IndividualFormControl(translate,'Partial Date', 'dobAspect',
          '', Validators.compose([Validators.required, Validators.pattern('(1|2)')]))
    });
  }

  get formControls(): IndividualFormControl[] {
    return Object.keys(this.controls)
      .map(k => this.controls[k] as IndividualFormControl);
  }

  getFormValidationMessages(form: any): string[] {
    const messages: string[] = [];
    this.formControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));

    console.log(messages);
    return messages;

  }
}

export class CensusIndividualFormGroup extends IndividualFormGroup {

  constructor(public translate: TranslateService) {
    super(translate);
    super.addControl('bIsToA', new IndividualFormControl(translate,'Relationship to Head', 'bIsToA',
      '', Validators.compose([Validators.pattern('([1-9])')]))),
    super.addControl('spouse', new IndividualFormControl(translate,'Spouse (if one)', 'spouse',
      '', Validators.compose([])));
  }


  getFormValidationMessages(form: any): string[] {
    return super.getFormValidationMessages(self);
  }

  async getFormHelpMessage(label) {
    let helpMessages = undefined;
    await this.translate.get('individualFormHelpMessages').forEach(x => helpMessages = x);
    return helpMessages[label];
  }
}
