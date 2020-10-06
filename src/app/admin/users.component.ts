import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfirmationService, MessageService} from 'primeng/api';
import {EditUser, Roles, User} from './users.model';
import {UsersService} from './users.service';
import {DataService} from '../services/data.service';
import {ConfirmPasswordValidator} from '../services';

@Component({
  // selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService]
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  userEdit: BsModalRef;
  editCurUser: User;
  registerForm: FormGroup;
  register: User;
  userForm: FormGroup;
  submitted: boolean;
  dataLoaded = false;
  editedUser: EditUser;
  reportPdfModal: BsModalRef;
  reportTemp: any;
  addUserModal: BsModalRef;
  roles: Roles[];
  cols: ({ field: string; header: string })[] = [];
  // @ts-ignore
  @ViewChild('regSuccessModalTemp') private modalTemp;
  private loginUser: User;

  constructor(
    private http: UsersService,
    private modalService: BsModalService,
    private dataStore: DataService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }

  // convenience getter for easy access to form fields
  get r() {
    return this.registerForm.controls;
  }

  ngOnInit() {
    this.loginUser = this.dataStore.getUser();

    this.cols.push({field: 'firstName', header: 'First Name'});
    this.cols.push({field: 'lastName', header: 'Last Name'});
    this.cols.push({field: 'username', header: 'Username'});
    this.cols.push({field: 'email', header: 'Email'});
    this.cols.push({field: 'roles', header: 'Roles Count'});
    this.cols.push({field: 'action', header: 'Action'});

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', Validators.required],
      firstName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: ConfirmPasswordValidator.MatchPassword
    });

    this.getRoles();
    this.refresh();
  }

  editUser(userEdit: TemplateRef<any>, user: User) {
    this.submitted = false;
    this.userForm = this.formBuilder.group({
      username: [user.username, Validators.required],
      lastName: [user.lastName, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      phoneNo: [user.phoneNo, Validators.required],
      firstName: [user.firstName, [Validators.required]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.minLength(6)]]
    }, {
      validators: ConfirmPasswordValidator.MatchPassword
    });
    this.editCurUser = user;
    this.userEdit = this.modalService.show(userEdit);
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    } else {
      this.editedUser = this.userForm.value;
      this.editedUser.id = this.editCurUser.id;
      this.editedUser.status = this.editCurUser.status;
      this.editUserPut(this.editedUser);
      this.userEdit.hide();
    }
  }

  addNewUser() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    } else {
      this.register = this.registerForm.value;
      this.register.roles = [];
      this.registerPost();
    }
  }

  registerPost() {
    this.http.addNewUser(this.register).pipe(first())
      .subscribe(data => {
        this.users.push(data);
        this.addUserModal.hide();
        this.messageService.add({severity: 'success', summary: 'Register Success', detail: 'New User added successfully!'});
      });
  }

  addUserForm(addUserModalTemp: TemplateRef<any>) {
    this.submitted = false;
    this.registerForm.reset();
    this.addUserModal = this.modalService.show(addUserModalTemp);
  }

  refresh() {
    this.http.getUsers().pipe().subscribe(
      data => {
        this.users = data.filter(d => d.username !== 'raines');
        this.dataLoaded = true;
      });
  }

  getRoles() {
    this.http.getRoles().pipe(first()).subscribe(
      data => {
        this.roles = data;
      });
  }

  disableUser(user) {
    this.editCurUser = user;
    user.status = false;
    this.editUserPut(user);
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to user ' + user.username + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteUser(user).pipe(first()).subscribe(
          () => {
            this.users = this.users.filter(f => f !== user);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Success', detail: user.username.toUpperCase() + ' Removed from Database!'
            });
          }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  enableUser(user) {
    this.editCurUser = user;
    user.status = true;
    this.editUserPut(user);
  }

  private editUserPut(user) {
    const oldDataSet = [...this.users];
    this.http.editUser(user).pipe(first())
      .subscribe(data => {
          oldDataSet[this.users.indexOf(this.editCurUser)] = data;
          this.users = oldDataSet;
          this.messageService.add({
            severity: 'success',
            summary: 'Update Success', detail: this.editCurUser.username.toUpperCase() + ' updated successfully!'
          });
        },
        error1 => {
          this.messageService.add({
            severity: 'error',
            summary: error1.error.error, detail: error1.error.message
          });
          // console.log(error1.error);
        });
  }
}
