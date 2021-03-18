import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {UsersService} from "../users.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'contact.component.html'
})
export class ContactComponent implements OnInit {
  // private static router: Router;
  contactForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  date = new Date().getFullYear();
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private userService: UsersService) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.contactForm.controls;
  }

  ngOnInit() {
    // sessionStorage.setItem('rtng', String(DashboardComponent.random(9000000000, 1000000000)));
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      // captcha: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.contactForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.contact(this.contactForm.value).pipe(first()).subscribe(
    user => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Your Message has being received. The Admin will contact you shortly'
        });

        this.submitted = false;
        this.contactForm.reset({}, {onlySelf: true, emitEvent: false});
      },
    () => {
      this.loading = false;
    });
  }

}
