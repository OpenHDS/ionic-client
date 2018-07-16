import { FormControl, FormGroup, Validators } from "@angular/forms";

export class IndividualFormControl extends FormControl {
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
            let message = (`${this.label} contains illegal values.`);

            //Add custom message to the default based on property.
            if(this.modelProperty == "gender"){
              message += " Please enter M (Male) or F (Female).";
            } else if(this.modelProperty == "bIsToA" || this.modelProperty == "partialDate"){
              message += " Click on the help (?) icon for valid inputs."
            }
            messages.push(message);
            break;
        }
      }
    }
    return messages;
  }
}

export class IndividualFormGroup extends FormGroup {
  //Form group, fieldworker and socialId are auto-populated fields!
  constructor() {
    super({
      collectedBy: new IndividualFormControl("Fieldworker", "collectedBy", "" , Validators.compose([]), true),
      extId: new IndividualFormControl("External Id", "extId", "",
       [Validators.compose([Validators.required,
         Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      firstName: new IndividualFormControl("First Name", "firstName", "",
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      middleName: new IndividualFormControl("Middle Name", "middleName", "",
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      lastName: new IndividualFormControl("Last Name", "lastName", "",
        [Validators.compose([Validators.required,
          Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])]),
      gender: new IndividualFormControl("Gender", "gender", "",
        [Validators.compose([Validators.required,
          Validators.pattern('(M|F)')])]),
      dob: new IndividualFormControl("Date of Birth", "dob", "",
        [Validators.compose([Validators.required])]),
      partialDate: new IndividualFormControl("Partial Date", "partialDate", "", Validators.compose([Validators.required, Validators.pattern("(1|2)")]))
    });
  }

  get individualFormControls(): IndividualFormControl[] {
    return Object.keys(this.controls)
      .map(k => this.controls[k] as IndividualFormControl);
  }

  getFormValidationMessages(form: any) : string[] {
    let messages: string[] = [];
    this.individualFormControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m)));

    console.log(messages);
    return messages;

  }
}

export class CensusIndividualFormGroup extends IndividualFormGroup{
  constructor(){
    super();
    super.addControl("bIsToA", new IndividualFormControl("Relationship to Head", "bIsToA",
      "", Validators.compose([Validators.pattern("([1-9])")])))
    super.addControl("spouse", new IndividualFormControl("Spouse (if one)", "spouse",
      "", Validators.compose([])))
  }

  get relationToHeadFields(): string[] {
    return ["1 - Head", "2 - Spouse", "3 - Son/Daughter", "4 - Brother/Sister", "5 - Parent",
      "6 - Grandchild", "7 - Not Related", "8 - Other Relative", "9 - Don't Know"]
  }

  getFormValidationMessages(form: any): string[] {
    return super.getFormValidationMessages(self);
  }
}
