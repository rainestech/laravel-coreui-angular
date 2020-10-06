import {Component, Input, OnInit} from '@angular/core';
import {Roles, User} from '../users.model';
import {UsersService} from '../users.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {DataService} from '../../services/data.service';
import {FileStorage} from '../../storage/storage.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loginUser: User;
  imageSrc: any[] = [];
  domains: string[] | Roles[];
  dataLoaded = false;
  passportError: any[] = [];
  nameForm: FormGroup;
  passwordForm: FormGroup;
  submitted = false;
  view = 1;
  passport: FileStorage[] = [];
  @Input() header = false;

  constructor(private http: UsersService,
              private dataStore: DataService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private sanitizer: DomSanitizer,
              private formBuilder: FormBuilder) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.nameForm.controls;
  }

  get p() {
    return this.passwordForm.controls;
  }

  ngOnInit() {
    this.loginUser = this.dataStore.getUser();
    let fs = this.loginUser.passport;

    if (!fs) {
      fs = new FileStorage();
      fs.objID = this.loginUser.id;
      fs.tag = 'passport';
    }

    this.passport = [fs];

    this.domains = this.loginUser.roles;
    console.log(this.domains);
    this.dataLoaded = true;
  }

  updateName() {
    this.nameForm = this.formBuilder.group({
      id: [this.loginUser.id, Validators.required],
      firstName: [this.loginUser.firstName, Validators.required],
      lastName: [this.loginUser.lastName, Validators.required],
      phoneNo: [this.loginUser.phoneNo, Validators.required],
      username: [this.loginUser.username, Validators.required],
      email: [this.loginUser.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      tenants: [this.loginUser.tenants ? this.loginUser.tenants : '', Validators.required],
    });
    this.view = 2;
  }

  cancel() {
    this.nameForm = null;
    this.passwordForm = null;
    this.view = 1;
  }

  submitName() {
    this.submitted = true;
    if (this.nameForm.invalid) {
      return;
    } else {
      const edit = this.nameForm.value;
      edit.status = this.loginUser.status;
      this.editUserPut(edit);
    }
  }

  submitPassword() {
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return;
    } else {
      const edit = this.passwordForm.value;
      edit.status = this.loginUser.status;
      this.editUserPut(edit, true);
    }
  }

  changePassword() {
    this.passwordForm = this.formBuilder.group({
      id: [this.loginUser.id, Validators.required],
      firstName: [this.loginUser.firstName, Validators.required],
      lastName: [this.loginUser.lastName, Validators.required],
      phoneNo: [this.loginUser.phoneNo, Validators.required],
      username: [this.loginUser.username, Validators.required],
      email: [this.loginUser.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      oldPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.minLength(6)]],
      tenants: [this.loginUser.tenants ? this.loginUser.tenants : '', Validators.required],
    });
    this.view = 3;
  }

  private editUserPut(user, password = false) {
    this.http.editUser(user).pipe(first())
      .subscribe(data => {
        this.loginUser = data;
        if (password) {
          this.messageService.add({
            severity: 'success',
            summary: 'Update Success', detail: data.username.toUpperCase() + ' password changed!'
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Update Success', detail: data.username.toUpperCase() + ' updated successfully!'
          });
        }
      });
    this.cancel();
  }
}
