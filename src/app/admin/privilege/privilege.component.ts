import {Component, OnInit, TemplateRef} from '@angular/core';
import {Roles, User} from '../users.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormGroup} from '@angular/forms';
import {UsersService} from '../users.service';
import {MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.css'],
  providers: [MessageService]
})
export class PrivilegeComponent implements OnInit {

  dataLoaded = false;
  roles: Roles[] = [];
  roleList: Roles[] = [];
  dataSet: User[];
  editCurUser: User;
  roleEdit: BsModalRef;

  cols: ({ field: string; header: string })[];
  selRoles: Roles[];
  nameInput: FormGroup;
  private draggedRole: Roles;

  constructor(private http: UsersService,
              private modalService: BsModalService,
              private messageService: MessageService,
  ) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.nameInput.controls;
  }

  ngOnInit() {
    this.cols = [
      {field: 'username', header: 'Username'},
      {field: 'firstName', header: 'Name'},
      {field: 'roles', header: 'Role Count'},
      {field: 'action', header: 'Action'}
    ];

    this.http.getRoles().pipe(first()).subscribe(
      data => {
        this.roles = data;
      });

    this.refresh();
  }

  refresh() {
    this.http.getUsers().pipe().subscribe(
      data => {
        this.dataSet = data.filter(d => d.username !== 'raines');
        this.dataLoaded = true;
      });
  }

  editRole(roleEdit: TemplateRef<any>, user: User) {
    this.resetVars();

    this.editCurUser = user;
    this.selRoles = [...user.roles];
    // console.log(this.selRoles);
    this.setList();
    this.roleEdit = this.modalService.show(roleEdit, {class: 'modal-lg'});
  }

  resetVars() {
    this.roleList = this.roles;
    this.selRoles = [];
  }

  setList() {
    let filter = this.roles;
    this.selRoles.forEach(function (e) {
      filter = filter.filter(a => a.role !== e.role);
    });
    this.roleList = filter;
  }

  dragStart($event: any, role: Roles) {
    this.draggedRole = role;
  }

  dragEnd() {
    this.draggedRole = null;
  }

  drop() {
    if (this.draggedRole) {
      this.selRoles = [...this.selRoles, this.draggedRole];
      this.roleList = this.roleList.filter(c => c.role !== this.draggedRole.role);
    }
  }

  addAccess(role: Roles) {
    this.selRoles = [...this.selRoles, role];
    this.roleList = this.roleList.filter(c => c.role !== role.role);
  }

  removeAccess(role: Roles) {
    this.selRoles = this.selRoles.filter(e => e !== role);
    this.roleList.push(role);
  }

  processAccess() {
    this.editCurUser.roles = this.selRoles;
    const oldDataSet = [...this.dataSet];
    this.http.editUserRole(this.editCurUser).pipe(first()).subscribe(
      data => {
        oldDataSet[this.dataSet.indexOf(this.editCurUser)] = data;
        this.dataSet = oldDataSet;
        this.roleEdit.hide();
        this.messageService.add({
          severity: 'success',
          summary: 'Role Assign Success',
          detail: 'User Roles & Privileges persisted to database!'
        });
        this.resetVars();
      }
    );
  }

}
