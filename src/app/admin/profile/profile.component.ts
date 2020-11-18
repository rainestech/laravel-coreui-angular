import {Component, Input, OnInit} from '@angular/core';
import {Roles, User} from '../users.model';
import {UsersService} from '../users.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {DataService} from '../../services/data.service';
import {FileStorage} from '../../storage/storage.model';
import {ConfirmPasswordValidator} from "../../services";

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
      firstName: [this.loginUser.firstName, Validators.required],
      lastName: [this.loginUser.lastName, Validators.required],
      phoneNo: [this.loginUser.phoneNo, Validators.required],
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
    this.nameForm.updateValueAndValidity();
    if (this.nameForm.invalid) {
      return;
    } else {
      const edit = this.nameForm.value;
      this.loginUser.firstName = edit.firstName;
      this.loginUser.lastName = edit.lastName;
      this.loginUser.phoneNo = edit.phoneNo;

      this.editUserPut(this.loginUser);
    }
  }

  submitPassword() {
    this.submitted = true;
    this.passwordForm.updateValueAndValidity();
    if (this.passwordForm.invalid) {
      return;
    } else {
      const edit = this.passwordForm.value;
      const data = {id: this.loginUser.id, oldPassword: edit.oldPassword, password: edit.password};

      this.savePassword(data);
    }
  }

  changePassword() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.minLength(6)]],
      oldPassword: ['', [Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: ConfirmPasswordValidator.MatchPassword
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

  private savePassword(data: any) {
    this.http.changePwd(data).pipe(first()).subscribe(res => {
      this.cancel();
      this.messageService.add({
        severity: 'success',
        summary: 'Update Success', detail: res.username.toUpperCase() + ' password changed!'
      });
    });
  }
}
