import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Cols, Roles, User} from "../admin/users.model";
import {UsersService} from "../admin/users.service";
import {first} from "rxjs/operators";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ConfirmPasswordValidator} from "../../../../../src/app/services";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  dataLoaded = false;
  gridList = true;
  searchTerm = new FormControl('');
  @ViewChild('dt') table: any;
  users: User[] = [];
  allUsers: User[] = [];
  p = 1;
  fileLink = '';
  cols: Cols[] = [];
  view = 1;
  selProfile: any;
  userForm: FormGroup;
  modalTitle = 'Add New User to Platform';
  userEdit: BsModalRef;
  submitted = false;
  roles: Roles[] = [];
  curUser: User;
  get f() { return this.userForm.controls; }

  constructor(private http: UsersService,
              private formBuilder: FormBuilder,
              private confirmService: ConfirmationService,
              private messageService: MessageService,
              private modalService: BsModalService) { }

  ngOnInit(): void {
    this.cols = [
      {header: 'Name', field: 'name'},
      {header: 'Email', field: 'email'},
      {header: 'Username', field: 'username'},
      {header: 'Join Date', field: 'createdAt'},
      {header: 'Role', field: 'role'},
    ];
    this.refresh();
    this.http.getRoles().pipe(first()).subscribe(res => this.roles = res);

    this.searchTerm.valueChanges.subscribe(value => {
      if (value.length > 0) {
        this.users = this.allUsers.filter(u => u.username.toLowerCase().includes(value.toLowerCase())
            || u.email.toLowerCase().includes(value.toLowerCase()) || u.firstName?.toLowerCase().includes(value.toLowerCase())
            || u.role.toLowerCase().includes(value.toLowerCase())
            || u.lastName?.toLowerCase().includes(value.toLowerCase()));
      } else {
        this.users = this.allUsers;
      }
    });
  }

  editUser(userEdit: TemplateRef<any>, user: User) {
    this.submitted = false;
    this.userForm = this.formBuilder.group({
      username: [user?.username, Validators.required],
      lastName: [user?.lastName, Validators.required],
      email: [user?.email, [Validators.required, Validators.email]],
      firstName: [user?.firstName, [Validators.required]],
      role: [user?.roles[0]?.id, [Validators.required]],
      status: [user?.status ? 1 : 0, [Validators.required]],
      password: ['', [Validators.minLength(6)]],
      password_confirmation: ['', [Validators.minLength(6)]]
    }, {
      validators: ConfirmPasswordValidator.MatchPassword
    });
    if (user) { this.curUser = user; }
    this.userEdit = this.modalService.show(userEdit);
  }

  refresh() {
    this.http.getUsers().pipe(first()).subscribe(res => {
      this.users = res;
      this.allUsers = res;
      this.dataLoaded = true;
    });
  }

  viewDetails(rec: User) {

  }

  deleteUser(rec: User) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete user ' + rec.username + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteUser(rec).pipe(first()).subscribe(
            () => {
              this.users = this.users.filter(f => f !== rec);
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: rec.username.toUpperCase() + ' Removed from Platform!'
              });
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  close() {
    this.view = 1;
  }

  onSubmit() {
    this.submitted = true;
    this.userForm.updateValueAndValidity();
    if (this.userForm.invalid) {
      return;
    } else {
      const data = this.userForm.value;
      data.status = +data.status === 1;
      data.role = [this.roles.find(r => r.id === +data.role)];
      if (this.curUser) {
        data.id = this.curUser.id;
        this.put(data);
      } else {
        this.post(data);
      }
    }
  }

  post(data: User) {
    this.http.addNewUser(data).pipe(first())
        .subscribe(data => {
          this.users.push(data);
          this.userEdit.hide();
          this.messageService.add({severity: 'success', summary: 'Register Success', detail: 'New User added successfully!'});
        });
  }

  put(user) {
    const oldDataSet = [...this.users];
    this.http.editUser(user).pipe(first())
        .subscribe(data => {
          this.userEdit.hide();
          oldDataSet[this.users.indexOf(this.curUser)] = data;
          this.users = oldDataSet;
          this.messageService.add({
            severity: 'success',
            summary: 'Update Success', detail: this.curUser.username.toUpperCase() + ' updated successfully!'
          });
        });
  }
}
