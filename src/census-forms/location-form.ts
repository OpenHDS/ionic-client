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
            let message = (`${this.label} contains illegal characters. Characters should be alphabetical or numeric.`);

            if(this.modelProperty == "type"){
              message += " Location Type should be RUR (Rural) or URB (Urban). Click the help (?) icon for more information.";
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
  //Form group, fieldworker and locationLevel are auto-populated fields!
  constructor() {
      super({
        collectedBy: new LocationFormControl("Fieldworker", "collectedBy", "" , [], true),
        locationLevel: new LocationFormControl("Subvillage", "locationLevel", "", [], true),
        locationName: new LocationFormControl("Location Name", "locationName", "",
          [Validators.compose([Validators.required,
            Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
        extId: new LocationFormControl("External Id", "extId", "",
          [Validators.compose([Validators.required,
            Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
        type: new LocationFormControl("Location Type", "type", "",
          [Validators.compose([Validators.required,
            Validators.pattern("(URB|RUR)")])])
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
