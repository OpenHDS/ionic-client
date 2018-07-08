import { FormControl, FormGroup, Validators } from "@angular/forms";

export class SocialGroupFormControl extends FormControl {
  label: string;
  modelProperty: string;

  constructor(label:string, property:string, value: any, validator: any, disabled?: boolean) {
    super({value: value, disabled: disabled}, validator);
    this.label = label;
    this.modelProperty = property;
  }

  getValidationMessages() {
    let messages: string[] = [];
    if (this.errors) {
      for (let errorName in this.errors) {
        switch (errorName) {
          case "required":
            messages.push(`You must enter a ${this.label}`);
            break;
          case "pattern":
            messages.push(`The ${this.label} contains illegal characters`);
            break;
        }
      }
    }


    return messages;
  }
}

export class SocialGroupFormGroup extends FormGroup {
  //Form group, fieldworker and locationId are auto-populated fields!
  constructor(fieldworker, locationId) {
    super({
      fieldworker: new SocialGroupFormControl("Fieldworker", "fieldworker", fieldworker , [], true),
      locationId: new SocialGroupFormControl("Location Id", "locationId", locationId, [], true),

      extId: new SocialGroupFormControl("External Id", "extId", "",
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      groupName: new SocialGroupFormControl("Group Name", "groupName", "",
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      groupType: new SocialGroupFormControl("Group Type", "groupType", "",
        [Validators.compose([Validators.required,
          Validators.pattern("^[^-\\s]*[Rr][Uu][Rr]|^[^-\\s]*[Uu][Rr][Bb]")])])
    });
  }

  get socialGroupControls(): SocialGroupFormControl[] {
    return Object.keys(this.controls)
      .map(k => this.controls[k] as SocialGroupFormControl);
  }

  getFormValidationMessages(form: any) : string[] {
    let messages: string[] = [];
    this.socialGroupControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));

    console.log(messages);
    return messages;

  }
}
