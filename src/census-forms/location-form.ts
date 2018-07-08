import { FormControl, FormGroup, Validators } from "@angular/forms";

export class LocationFormControl extends FormControl {
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

export class LocationFormGroup extends FormGroup {
  //Form group, fieldworker and locationLevel are auto-populated fields!
  constructor(fieldworker, locationLevel) {
      super({
        fieldworker: new LocationFormControl("Fieldworker", "fieldworker", fieldworker , [], true),
        subvillage: new LocationFormControl("Subvillage", "subvillage", locationLevel, [], true),
        locationName: new LocationFormControl("Location Name", "locationName", "",
          [Validators.compose([Validators.required,
            Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
        extId: new LocationFormControl("External Id", "extId", "",
          [Validators.compose([Validators.required,
            Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
        type: new LocationFormControl("Location Type", "type", "",
          [Validators.compose([Validators.required,
            Validators.pattern("^[^-\\s]*[Rr][Uu][Rr]|^[^-\\s]*[Uu][Rr][Bb]")])])
      });
  }

  get locationControls(): LocationFormControl[] {
    return Object.keys(this.controls)
      .map(k => this.controls[k] as LocationFormControl);
  }

  getFormValidationMessages(form: any) : string[] {
    let messages: string[] = [];
    this.locationControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));

    console.log(messages);
    return messages;

  }
}
