import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export class AdminCustomValidators {
        //Add custom validators like regex or pattern expression here

        // static selectBucket(c: FormControl): ValidationErrors {
        //             const selectedBucket = c.value;
        //             const message={"errorMessage":"Please select a Bucket"};
        //             if(selectedBucket==="selectBucket")
        //             {
        //                     return message;
        //             }
        //             return null;
        // }
        static validateTags(formGroup: FormGroup) {
                for (let key in formGroup.controls) {
                        if (formGroup.controls.hasOwnProperty(key)) {
                                let control: FormControl = <FormControl>formGroup.controls[key];
                                if (control.value) {
                                        return null;//if valid
                                }
                        }
                }
                return {
                        validateTags: {
                                valid: false
                        }
                };
        }
}