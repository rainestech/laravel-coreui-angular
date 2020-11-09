import {AbstractControl} from '@angular/forms';

export class ConfirmPasswordValidator {
  static MatchPassword(control: AbstractControl) {
    const password = control.get('password').value;

    const confirmPassword = control.get('password_confirmation').value;

    if (password !== confirmPassword) {
      control.get('password_confirmation').setErrors({mismatch: true});
    } else {
      return null;
    }
  }
}
