import {Component, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UsersService} from '../users.service';
import {User} from '../users.model';
import {MessageService} from 'primeng/api';
import {ConfirmPasswordValidator, PasswordValidator} from "../../../../../../src/app/services";
import {emailProviders} from "../../public.mail.providers";
import {FileStorage} from "../../storage/storage.model";
import {industryOptions, typeOptions} from "../../profile/view/profile.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  submitted = false;
  loading = false;
  newReg: User;
  registerForm: FormGroup;
  view = 1;
  emailProvider:string[] = emailProviders;
  date = new Date().getFullYear();

  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];
  @ViewChildren('formRow') rows: any;
  form: FormGroup;
  validationError = false;
  fieldTypePassword = true;
  logo: FileStorage[];
  industryOption = industryOptions;
  types = typeOptions;

  viewPassword() {
    this.fieldTypePassword = !this.fieldTypePassword;
  }

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private usersService: UsersService) {
    this.form = this.toFormGroup(this.formInput);
  }

  toFormGroup(elements) {
    const group: any = {};
    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.registerForm.updateValueAndValidity();
    this.submitted = true;

    // stop here if form is invalid
    if (this.emailProvider.find(e => e === this.registerForm.controls.email.value.split("@").pop())) {
      this.messageService.add({
        severity: 'error',
        summary: 'Please provide a valid company email address'
      });

      this.registerForm.controls.email.setErrors({companyEmail: 'Invalid Company email'});
      return;
    }

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const user: User = this.registerForm.value;
    this.usersService.verifyNewUser(user).pipe(first()).subscribe(
        res => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Account Creation Success',
            detail: 'Account Registration successful, proceed to verify your account.'
          });
          this.newReg = res;
          this.view = 2;
        }, error => {
          this.loading = false;
        });  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      companyName: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password_confirmation: ['', Validators.required],
      logo: ['', Validators.required],
      website: ['', Validators.required],
      size: ['', Validators.required],
      type: ['', Validators.required],
      industry: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: [ConfirmPasswordValidator.MatchPassword, PasswordValidator.password]
    });

    this.registerForm.controls.email.valueChanges.subscribe(value => {
      if (this.emailProvider.find(e => e === value.split("@").pop())) {
        this.messageService.add({
          severity: 'error',
          summary: 'Please provide a valid company email address'
        });
        this.registerForm.controls.email.setErrors({companyEmail: 'Invalid Company email'});
      }
    });

    const fs: FileStorage = new FileStorage();
    fs.objID = 0;
    fs.tag = 'logo';
    this.logo = [fs];
  }

  keyUpEvent(event, index) {
    let pos = index;
    // console.log(event.code);
    // console.log(event.which);

    if (event.which === 8) {
      pos = index - 1 ;
    } else {
      pos = index + 1 ;
    }
    if (pos > -1 && pos < this.formInput.length ) {
      this.rows._results[pos].nativeElement.focus();
    }
  }

  submitOtp() {
    this.validationError = false;
    const data = this.form.value;
    const req = '' + data.input1 + data.input2 + data.input3 + data.input4 + data.input5 + data.input6;
    this.usersService.userVerification({username: this.newReg.username, code: req}).pipe(first()).subscribe(res => {
      this.view = 3;
      this.messageService.add({severity: 'success', summary: 'Email Confirmed! Proceed to login.'});
      // this.router.navigate(['/login']);
      return;
    }, () => {
      this.validationError = true;
    })
  }

  regenerateToken() {
    this.usersService.regenerateToken({username: this.newReg.username, id: this.newReg.id}).pipe(first()).subscribe(() => {
      this.validationError = false;
      this.messageService.add({severity: 'success', summary: 'A new Email has been sent to ' + this.newReg.email + ' with new OTP. Check your email.'});
      return;
    })
  }

  updateLogo(event: FileStorage) {
    this.registerForm.controls.logo.setValue(event);
    this.logo = [event];
  }
}
