import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UsersService} from '../users.service';
import {User} from '../users.model';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'verify.component.html'
})
export class VerifyComponent implements OnInit {
  submitted = false;
  loading = false;
  newReg: User;
  verifyForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private router: Router,
              private usersService: UsersService) {
  }

  get f() {
    return this.verifyForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.verifyForm.invalid) {
      return;
    }

    this.loading = true;
    const user: { mcsNo: number, code: string } = this.verifyForm.value;
    this.usersService.userVerification(user).pipe(first()).subscribe(
      res => {
        this.loading = false;
        this.newReg = res;
        this.messageService.add({
          severity: 'success',
          summary: 'Account Verification Successful',
          detail: 'Account Verification successful, proceed to login'
        });
        this.redirectLogin();
      }, error => {
        this.loading = false;
      });
  }

  ngOnInit(): void {
    this.verifyForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      mcsNo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
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
