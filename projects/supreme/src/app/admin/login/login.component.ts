import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {DataService} from "../../service/data.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  // private static router: Router;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  date = new Date().getFullYear();
  error = '';

  fieldTypePassword = true;

  viewPassword() {
    this.fieldTypePassword = !this.fieldTypePassword;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private dataService: DataService,
    private authenticationService: AuthService) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    sessionStorage.setItem('rtng', 'gserrge eg eg ergeg eg');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
    // LoginComponent.router = this.router;

    if (!this.authenticationService.tokenExpired()) {
      return this.redirectLogin();
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value).pipe(first()).subscribe(
    user => {
        this.loading = false;
        this.dataService.setUser(user);
        this.redirectLogin();
      },
    () => {
      this.error = 'Invalid username/email and/or password!';
      this.loading = false;
    });
  }

  private redirectLogin(): void {
    this.router.navigate([this.returnUrl]).then(() => {
    }, res => {
      if (!res) {
        console.log(res +
          ' login nav fails, retrying...');
        // this.redirectLogin();
      }
    });
  }

}
