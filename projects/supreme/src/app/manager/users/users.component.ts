import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Endpoints} from "../../endpoints";
import {Cols, Roles, User} from "../../admin/users.model";
import {ConfirmationService, MessageService} from "primeng/api";
import {UsersService} from "../../admin/users.service";
import {first} from "rxjs/operators";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ConfirmPasswordValidator} from "../../../../../../src/app/services";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  searchTerm: FormControl = new FormControl('');
  gridList = true;
  recruiters: any[] = [];
  fileLink: string = Endpoints.mainUrl + Endpoints.fsDL + '/';
  p = 1;
  @ViewChild('dt') table: any;
  cols: Cols[] = [];
  dataLoaded = false;
  view = 1;
  users: User[] = [];
  allUsers: User[] = [];
  userForm: FormGroup;
  userEdit: BsModalRef;
  submitted = true;
  modalTitle = 'Add New User';
  curUser: User;
  get f() { return this.userForm.controls; };
  roles: Roles[] = [];

  constructor(private http: UsersService,
              private messageService: MessageService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private confirmService: ConfirmationService) { }

  ngOnInit(): void {
    this.cols = [
      {header: 'Name', field: 'name'},
      {header: 'Company Name', field: 'companyName'},
      {header: 'Email', field: 'email'},
      {header: 'Reg. Date', field: 'createdAt'},
      {header: 'Role', field: 'role'},
    ];

    this.refresh();
    this.http.getRoles().pipe(first()).subscribe(res => this.roles = res);

    this.searchTerm.valueChanges.subscribe(value => {
      // console.log(this.allUsers.length);
      if (value.length > 0) {
        this.users = this.allUsers.filter(u => u.username.toLowerCase().includes(value.toLowerCase())
            || u.email.toLowerCase().includes(value.toLowerCase()) || u.firstName?.toLowerCase().includes(value.toLowerCase())
            || u.role.toLowerCase().includes(value.toLowerCase())
            || u.lastName?.toLowerCase().includes(value.toLowerCase()) || u.companyName?.toLowerCase().includes(value.toLowerCase()));
      } else {
        this.users = this.allUsers;
      }
    });
  }

  refresh() {
    this.searchTerm.reset('', {emitEvent: false, onlySelf: true});
    this.http.getUsers().pipe(first()).subscribe(res => {
      this.users = res;
      this.allUsers = res;
      this.dataLoaded = true;
    });
  }

  toggleView() {
    this.gridList = !this.gridList;
  }

  deleteUser(user: User) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete user ' + user.username + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteUser(user).pipe(first()).subscribe(
            () => {
              this.users = this.users.filter(f => f !== user);
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: user.username.toUpperCase() + ' Removed from Platform!'
              });
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  editUser(userEdit: TemplateRef<any>, user: User) {
    this.submitted = false;
    this.userForm = this.formBuilder.group({
      username: [user?.username, Validators.required],
      lastName: [user?.lastName, Validators.required],
      email: [user?.email, [Validators.required, Validators.email]],
      companyName: [user?.companyName],
      firstName: [user?.firstName, [Validators.required]],
      role: [user?.role, [Validators.required]],
      status: [user?.status === true ? 1 : 0, [Validators.required]],
      password: ['', [Validators.minLength(6)]],
      password_confirmation: ['', [Validators.minLength(6)]]
    }, {
      validators: ConfirmPasswordValidator.MatchPassword
    });
    if (user) { this.curUser = user; }
    this.userEdit = this.modalService.show(userEdit, {backdrop: 'static', keyboard: false});
  }

  onSubmit() {
    this.submitted = true;
    this.userForm.updateValueAndValidity();
    if (this.userForm.invalid) {
      return;
    } else {
      const data = this.userForm.value;
      data.status = +data.status === 1;
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
