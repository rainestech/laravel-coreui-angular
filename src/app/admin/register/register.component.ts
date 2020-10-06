import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UsersService} from '../users.service';
import {User} from '../users.model';
import {MessageService} from 'primeng/api';
import {ConfirmPasswordValidator} from '../../services';

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

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private usersService: UsersService) {
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
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
          detail: 'Account Registration successful, proceed to verify account to enable login'
        });
        this.newReg = res;
        // this.redirectVerify();
        this.view = 2;
      }, error => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Account Creation Failed',
          detail: 'Make sure your MCS Number is correct and that your phone number is the same with the cooperative registry'
        });
      });
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      phoneNo: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: ConfirmPasswordValidator.MatchPassword
    });
  }

  private redirectVerify(): void {
    this.router.navigate(['/verify']).then(() => {
    }, res => {
      if (!res) {
        this.redirectVerify();
      }
    });
  }
}
