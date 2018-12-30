import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

export const targetSelectedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const group = control.get('group');
  const lounge = control.get('lounge');

  return group && lounge &&
    ( !group.value && !lounge.value ) ?
    { 'selected': true } : null;
};

@Directive({
  selector: '[appTargetSelected]',
  providers: [{provide: NG_VALIDATORS, useExisting: TargetSelectedValidatorDirective, multi: true }]
})
export class TargetSelectedValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return targetSelectedValidator(control);
  }

}
