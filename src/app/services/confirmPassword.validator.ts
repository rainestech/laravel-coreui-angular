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

export class PasswordValidator {
  static password(control: AbstractControl) {
    const password = control.get('password').value;

    const regex1: RegExp = /\d/;
    const regex2: RegExp = /[A-Z]/;
    const regex3: RegExp = /[a-z]/;
    const regex4: RegExp = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;

    if(!regex1.test(password)) { control.get('password').setErrors({number: true}); console.log('Test Failed') }
    else if(!regex2.test(password)) { control.get('password').setErrors({uppercase: true}) }
    else if(!regex3.test(password)) { control.get('password').setErrors({lowercase: true}) }
    // else if(limit && !regex4.test(password)) { control.setErrors({characters: true}) }
    else {
      return null;
    }
  }
}
