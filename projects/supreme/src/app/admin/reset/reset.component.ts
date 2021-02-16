import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UsersService} from '../users.service';
import {User} from '../users.model';
import {MessageService} from 'primeng/api';
import {ConfirmPasswordValidator, PasswordValidator} from "../../../../../../src/app/services";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'reset.component.html'
})
export class ResetComponent implements OnInit {
  submitted = false;
  loading = false;
  newReg: User;
  verifyForm: FormGroup;
  resetForm: FormGroup;
  otpSent = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private router: Router,
              private usersService: UsersService) {
  }

  get f() {
    return this.verifyForm.controls;
  }

  get r() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.verifyForm.invalid) {
      return;
    }

    this.loading = true;
    const user: string = this.verifyForm.controls.email.value;
    this.usersService.forgotPassword({email: user}).pipe(first()).subscribe(
      res => {
        this.loading = false;
        this.newReg = res;
        this.messageService.add({
          severity: 'success',
          summary: 'Password Reset Process has began!',
        });
        this.otpSent = true;
        this.resetForm.controls.email.setValue(user);
        this.submitted = false;
        this.loading = false;
      }, error => {
        this.loading = false;
      });
  }

  resetPassword() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    const user: {otp: string, password: string, confirm_password: string} = this.resetForm.value;
    this.usersService.resetPassword(user).pipe(first()).subscribe(
      res => {
        this.loading = false;
        this.newReg = res;
        this.messageService.add({
          severity: 'success',
          summary: 'Password Reset Successfully!',
          detail: 'Your account password has been reset with the given password, proceed to login'
        });
        this.redirectLogin();
      }, error => {
        this.loading = false;
      });
  }

  ngOnInit(): void {
    this.verifyForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(6)]],
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
    }, {
      validators: [ConfirmPasswordValidator.MatchPassword, PasswordValidator.password]
    });
  }


  private redirectLogin(): void {
    this.router.navigate(['/login']).then(() => {
    }, res => {
      if (!res) {
        this.redirectLogin();
      }
    });
  }
}
