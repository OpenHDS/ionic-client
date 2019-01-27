import { FormControl, FormGroup, Validators } from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";

export class SocialGroupFormControl extends FormControl {
  label: string;
  modelProperty: string;

  constructor(public translate: TranslateService, label:string, property:string, value: any, validator: any, disabled?: boolean) {
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

            if(this.modelProperty === 'extId' || this.modelProperty === 'groupName') {
              this.translate.get('formFieldPatternError', {value: this.label}).forEach(async x => messages.push(x));
            } else if(this.modelProperty === 'groupType') {
              this.translate.get('socialGroupFormTypeError', {value: this.label}).forEach(async x => messages.push(x));
            }

            break;
        }
      }
    }

    return messages;
  }
}

export class SocialGroupFormGroup extends FormGroup {

  // Form group, fieldworker and locationId are auto-populated fields!
  constructor(public translate: TranslateService) {
    super({
      collectedBy: new SocialGroupFormControl(translate, 'Fieldworker', 'collectedBy', '' , [], true),
      extId: new SocialGroupFormControl(translate,'External Id', 'extId', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      groupName: new SocialGroupFormControl(translate,'Group Name', 'groupName', '',
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      groupType: new SocialGroupFormControl(translate,'Group Type', 'groupType', '',
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

  async getFormHelpMessage(formLabel){
    let helpMessages = undefined;
    await this.translate.get('socialGroupTypeHelp').forEach(x => helpMessages = x);
    return helpMessages.type;
  }
}

