import {Component, OnInit, TemplateRef} from '@angular/core';
import {Privilege, Tenants, User} from '../users.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {UsersService} from '../users.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent implements OnInit {
  dataSet: Tenants[] = [];
  cols: ({ field: string; header: string })[];
  dataLoaded = false;
  tenantForm: FormGroup;
  editTitle: string = 'Add New Entity';
  dataEditRef: BsModalRef;
  submitted = false;
  loginUser: User;
  view = 1;
  moduleList: Privilege[] = [];
  modules: Privilege[] = [];
  selRoles: Privilege[] = [];
  private curTenant: Tenants;
  private newTenant: Tenants;
  private draggedRole: Privilege;
  private allPrivilege: Privilege[] = [];
  private selFullRoles: Privilege[] = [];

  constructor(private http: UsersService,
              private dataStore: DataService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.tenantForm.controls;
  }

  ngOnInit() {
    this.loginUser = this.dataStore.getUser();
    this.cols = [
      {field: 'name', header: 'Name'},
      {field: 'discriminator', header: 'Short Name'},
      {field: 'phoneNo', header: 'Phone No'},
      {field: 'status', header: 'Status'},
      {field: 'privileges', header: 'Modules Count'},
    ];
    this.initForm();
    this.refresh();
  }

  initForm() {
    this.tenantForm = this.formBuilder.group({
      name: ['', Validators.required],
      discriminator: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required],
      phoneNo: ['', Validators.required],
      isSuper: [0, Validators.required],
    });
  }

  addNew(addUserModalTemp: TemplateRef<any>) {
    this.submitted = false;
    this.initForm();
    this.dataEditRef = this.modalService.show(addUserModalTemp);
  }

  refresh() {
    this.http.getTenants().pipe(first()).subscribe(res => {
      const admin = res.find(r => r.id === 1);
      this.allPrivilege = admin.privileges;
      res = res.filter(r => r.id !== 1);
      this.modules = admin.privileges.filter((a, i) => admin.privileges.findIndex(b => b.module === a.module) === i);
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  moduleCount(data: Tenants) {
    const res = new Set([...data.privileges.map(d => d.module)]);
    return res.size;
  }

  editTenant(editTemplate: TemplateRef<any>, data: Tenants) {
    this.tenantForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      discriminator: [data.discriminator, Validators.required],
      address: [data.address, Validators.required],
      email: [data.email, Validators.required],
      phoneNo: [data.phoneNo, Validators.required],
      status: [data.status, Validators.required],
      isSuper: [data.isSuper, Validators.required],
      id: [data.id, Validators.required],
      uuid: [data.uuid, Validators.required],
      privileges: [data.privileges, Validators.required]
    });

    this.curTenant = data;
    this.submitted = false;
    this.dataEditRef = this.modalService.show(editTemplate);
  }

  disableTenant(data) {
    this.curTenant = data;
    data.status = false;
    this.put(data);
  }

  enableTenant(data) {
    this.curTenant = data;
    data.status = true;
    this.put(data);
  }

  deleteTenant(data) {
    this.http.deleteTenant(data).pipe(first()).subscribe(
      () => {
        this.dataSet = this.dataSet.filter(d => d.id !== data.id);
      });
  }

  onSubmit() {
    this.submitted = true;
    this.newTenant = this.tenantForm.value;
    if (this.newTenant.id) {
      this.put(this.newTenant);
    } else {
      this.newTenant.privileges = [];
      this.newTenant.status = true;
      this.post(this.newTenant);
    }
    this.dataEditRef.hide();
  }

  editModules(data, temp: TemplateRef<any>) {
    this.curTenant = data;
    this.moduleList = this.modules;
    this.selFullRoles = data.privileges;
    this.selRoles = data.privileges.filter((a, i) => data.privileges.findIndex(b => b.module === a.module) === i);
    this.selRoles.forEach(d => {
      this.moduleList = this.moduleList.filter(f => f.module !== d.module);
    });
    this.dataEditRef = this.modalService.show(temp, {class: 'modal-lg'});
  }

  dragStart($event: any, role: Privilege) {
    this.draggedRole = role;
  }

  dragEnd() {
    this.draggedRole = null;
  }

  addAccess(role: Privilege) {
    const fullModule = this.allPrivilege.filter(p => p.module === role.module);
    this.selRoles = [...this.selRoles, role];
    this.selFullRoles = [...this.selFullRoles, ...fullModule];
    this.moduleList = this.moduleList.filter(c => c.module !== role.module);
  }

  drop() {
    if (this.draggedRole) {
      this.addAccess(this.draggedRole);
    }
  }

  removeModule(role) {
    this.selRoles = this.selRoles.filter(e => e.module !== role.module);
    this.moduleList.push(role);
    this.selFullRoles = this.selFullRoles.filter(r => r.module !== role.module);
  }

  processAccess() {
    this.newTenant = this.curTenant;
    this.newTenant.privileges = this.selFullRoles;
    const oldDataSet = [...this.dataSet];
    this.http.editTenants(this.newTenant).pipe(first()).subscribe(
      data => {
        oldDataSet[this.dataSet.indexOf(this.curTenant)] = data;
        this.dataSet = oldDataSet;
        this.dataEditRef.hide();
        this.messageService.add({
          severity: 'success',
          summary: 'Modules Assign Success',
          detail: 'Entity Modules Saved successfully!'
        });
      }
    );
  }

  private put(data: Tenants) {
    this.http.editTenants(data).pipe(first()).subscribe(
      res => {
        const oldData = this.dataSet;
        oldData[this.dataSet.indexOf(this.curTenant)] = data;
        this.dataSet = oldData;
        this.messageService.add({
          severity: 'success',
          summary: 'Update Success',
          detail: this.curTenant.name + ' Updated Successfully!'
        });
      });
  }

  private post(data: Tenants) {
    this.http.saveTenants(data).pipe(first()).subscribe(
      res => {
        this.dataSet.push(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Save Success',
          detail: this.curTenant.name + ' Saved Successfully!'
        });
      });
  }
}
