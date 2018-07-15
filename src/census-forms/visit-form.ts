import { FormControl, FormGroup, Validators } from "@angular/forms";

export class VisitFormControl extends FormControl {
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

export class VisitFormGroup extends FormGroup {
  //Form group, fieldworker and socialId are auto-populated fields!
  constructor() {
    super({
      // collectedBy: new VisitFormControl("Collected By", "collectedBy", fieldworker, Validators.compose([]), true),
      // locationId: new VisitFormControl("Visit Location", "visitLocation", locationId, Validators.compose([]), true),
      extId: new VisitFormControl("External Id", "extId", "",
        Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])),
      visitDate:  new VisitFormControl("Visit Date", "visitDate", "",
        Validators.compose([Validators.required])),
      realVisit:  new VisitFormControl("Real Visit", "realVisit", "",
        Validators.compose([Validators.required, Validators.pattern('0|1+')])),
      roundNumber:  new VisitFormControl("Round Number", "roundNumber", "",
        Validators.compose([Validators.required, Validators.min(0)]))
    });
  }

  get visitFormControls(): VisitFormControl[] {
    return Object.keys(this.controls)
      .map(k => this.controls[k] as VisitFormControl);
  }

  getFormValidationMessages(form: any) : string[] {
    let messages: string[] = [];
    this.visitFormControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));
    return messages;

  }
}
