import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {first} from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Privilege, Roles} from "../../admin/users.model";
import {UsersService} from "../../admin/users.service";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  providers: [MessageService]
})
export class RolesComponent implements OnInit {
  dataLoaded = false;
  roles: Roles[] = [];
  editCurRole: Roles = {
    role: '',
    defaultRole: false
  };
  curRole: Roles = new Roles();
  roleEdit: BsModalRef;
  action = 'add';
  submitted = false;
  domains: string[];
  roleError = false;
  formTitle: string;
  cols: ({ field: string; header: string })[];
  children: Privilege[];
  selectedPrivileges: Privilege[];
  selModules: Privilege[] = [];
  nameInput: FormGroup;
  private appPrivileges: Privilege[];
  private access: Privilege[];
  private newRole: string;
  private draggedPrivilege: Privilege;
  private curModule: string;

  constructor(private http: UsersService,
              private modalService: BsModalService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private formBuilder: FormBuilder,
  ) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.nameInput.controls;
  }

  ngOnInit() {
    this.cols = [
      {field: 'role', header: 'Role'},
      {field: 'privileges', header: 'Privilege Count'},
      {field: 'defaultRole', header: 'Default Role'},
      {field: 'action', header: 'Action'}
    ];

    this.http.getRoles().pipe(first()).subscribe(
      data => {
        this.roles = data;
      });

    this.http.getDomains().pipe(first()).subscribe(
      data => {
        this.domains = data;
      });

    this.http.getPrivileges().pipe(first()).subscribe(
      data => {
        this.appPrivileges = data;
        this.dataLoaded = true;
      });
  }

  editRole(roleEdit: TemplateRef<any>, role: Roles) {
    this.resetVars();
    this.nameInput = this.formBuilder.group({
      role: [role.role, Validators.required],
      module: ['', Validators.required],
    });
    this.formValueChanges();
    // this.access = this.appPrivileges.filter(a => !role.privileges.includes(a));
    this.setAccess(role.privileges);
    this.editCurRole = role;
    this.newRole = role.role;
    this.selectedPrivileges = role.privileges.filter(u => u.hasChildren !== true);
    this.selModules = role.privileges.filter(u => u.hasChildren === true);
    this.formTitle = 'Editing ' + role.role.toUpperCase() + ' Role';
    this.roleEdit = this.modalService.show(roleEdit, {class: 'modal-lg'});
  }

  resetVars() {
    this.access = this.appPrivileges;
    this.selectedPrivileges = [];
    this.children = [];
    this.action = '';
    this.selModules = [];
  }

  setAccess(role: Privilege[]) {
    let filter = this.appPrivileges;
    role.forEach(function (e) {
      filter = filter.filter(a => a.privilege !== e.privilege);
    });
    this.access = filter;

    this.selModules = role.filter(u => u.hasChildren === true);
  }

  addRole(roleEdit: TemplateRef<any>) {
    this.resetVars();
    this.action = 'add';
    this.nameInput = this.formBuilder.group({
      role: ['', Validators.required],
      module: ['', Validators.required],
    });
    this.formValueChanges();
    this.formTitle = 'Add New Role';
    this.editCurRole = null;
    this.selectedPrivileges = [];
    this.roleEdit = this.modalService.show(roleEdit, {class: 'modal-lg'});
  }

  dragStart($event: any, child: Privilege) {
    this.draggedPrivilege = child;
  }

  dragEnd() {
    this.draggedPrivilege = null;
  }

  drop() {
    if (this.draggedPrivilege) {

      const module = this.selModules.find(m => m.module === this.draggedPrivilege.module);
      if (module === undefined) {
        const mods = this.access.find(f => f.module === this.draggedPrivilege.module && f.hasChildren === true);
        if (mods) {
          this.selModules = [...this.selModules, mods];
        }
      }

      this.selectedPrivileges = [...this.selectedPrivileges, this.draggedPrivilege];
      this.children = this.children.filter(c => c !== this.draggedPrivilege);
      this.access = this.access.filter(c => c !== this.draggedPrivilege);
    }
  }

  removeAccess(privilege: Privilege) {
    this.selectedPrivileges = this.selectedPrivileges.filter(e => e !== privilege);
    const modules = this.selectedPrivileges.filter(u => u.module === privilege.module);
    if (modules.length < 1) {
      this.selModules = this.selModules.filter(u => u.module !== privilege.module);
    }
    this.access.push(privilege);
    if (this.curModule === privilege.module) {
      this.children.push(privilege);
    }
  }

  formValueChanges() {
    this.nameInput.controls['role'].valueChanges.subscribe(
      (value) => {
        this.nameInput.get('role').setValue(value.toUpperCase(), {emitEvent: false});
        this.newRole = value;
      }
    );

    this.nameInput.controls['module'].valueChanges.subscribe(
      (value) => {
        this.curModule = value;
        const children = this.access.filter(p => p.module === value);
        this.children = children.filter(u => !u.hasChildren);
        // console.log(this.children);
      }
    );
  }

  processRole() {
    if (this.action === 'add') {
      this.curRole.role = this.newRole.toUpperCase();
    } else {
      this.curRole = this.roles.find(r => r.role === this.editCurRole.role);
      this.curRole.role = this.newRole.toUpperCase();
      this.roles = this.roles.filter(r => r.role !== this.editCurRole.role);
    }
    this.curRole.privileges = [...this.selectedPrivileges, ...this.selModules];

    this.http.editRole(this.curRole).pipe(first()).subscribe(
      data => {
        this.roles.push(data);
        this.roleEdit.hide();
        this.messageService.add({severity: 'success', summary: 'Update Success', detail: 'Role & Privileges persisted to database!'});
        this.resetVars();
      }
    );
  }

  deleteRole(role: Roles) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete role ' + role.role + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteRole(role).pipe(first()).subscribe(
          () => {
            this.roles = this.roles.filter(r => r !== role);
            this.messageService.add({severity: 'success', summary: 'Delete Success', detail: 'Role deleted from database!'});
          }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  addPrivilege(child: Privilege) {
    const module = this.selModules.find(m => m.module === child.module);
    if (module === undefined) {
      const mods = this.access.find(f => f.module === child.module && f.hasChildren === true);
      // console.log(mods);
      if (mods) {
        this.selModules = [...this.selModules, mods];
      }
    }

    this.selectedPrivileges = [...this.selectedPrivileges, child];
    this.children = this.children.filter(c => c !== child);
    this.access = this.access.filter(c => c !== child);
  }

  defaultRole(role: Roles) {
    role.defaultRole = true;
    this.http.defaultRole(role).pipe(first()).subscribe(
      data => {
        this.roles.push(data);
        this.roleEdit.hide();
        this.messageService.add({severity: 'success', summary: 'Update Success', detail: 'Role Now Default for New Members/Users'});
        this.resetVars();
      }
    );
  }
}
