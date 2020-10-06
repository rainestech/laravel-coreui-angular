import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersComponent} from './users.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {UsersRoutingModule} from './users-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RolesComponent} from './roles/roles.component';
import {PrivilegeComponent} from './privilege/privilege.component';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {TenantsComponent} from './tenants/tenants.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {MomentUtcDateAdapter} from '../services';
import {StorageModule} from '../storage/storage.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {OrderListModule} from 'primeng/orderlist';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmationService} from 'primeng/api';

@NgModule({
  declarations: [UsersComponent,
    RolesComponent,
    PrivilegeComponent,
    TenantsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    ModalModule.forRoot(),
    ConfirmDialogModule,
    TableModule,
    ToastModule,
    InputTextModule,
    OrderListModule,
    DragDropModule,
    MatInputModule,
    MatSelectModule,
    CKEditorModule,
    StorageModule
  ],
  exports: [
  ],
  providers: [ConfirmationService,
    {provide: MAT_DATE_LOCALE, useValue: 'en-NG'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
  ]
})

export class UsersModule {
}
