import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerComponent } from './manager.component';
import { ReportsComponent } from './reports/reports.component';
import {RouterModule, Routes} from "@angular/router";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {RolesComponent} from "./roles/roles.component";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {OrderListModule} from "primeng/orderlist";
import {DragDropModule} from "primeng/dragdrop";
import {ModalModule} from "ngx-bootstrap/modal";
import {NgxPaginationModule} from "ngx-pagination";
import {ContentLoaderModule} from "@ngneat/content-loader";
import {ViewModule} from "../profile/view/view.module";
import {PrivilegeComponent} from "./privilege/privilege.component";
import {LmsComponent} from "../lms/lms.component";
import {CustomPipe} from "../service/custom.pipe";
import {TooltipModule} from "ngx-bootstrap/tooltip";

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: ManagerComponent,
        data: {
          title: 'Manage Users'
        },
      },
      {
        path: 'users',
        component: ManagerComponent,
        data: {
          title: 'Manage Users'
        },
      },
      {
        path: 'lms',
        component: LmsComponent,
        data: {
          title: 'LMS Candidates'
        },
      },
      {
        path: 'report',
        component: ReportsComponent,
        data: {
          title: 'Platform Reports'
        },
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          title: 'Platform Roles'
        },
      },
      {
        path: 'access',
        component: PrivilegeComponent,
        data: {
          title: 'Access Control'
        },
      },
    ]
  }
];

@NgModule({
  declarations: [ManagerComponent, ReportsComponent, RolesComponent, PrivilegeComponent, LmsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BsDropdownModule,
        ModalModule.forChild(),
        TableModule,
        InputTextModule,
        ReactiveFormsModule,
        OrderListModule,
        DragDropModule,
        NgxPaginationModule,
        ContentLoaderModule,
        ViewModule,
        ModalModule.forChild(),
        CustomPipe,
        TooltipModule.forRoot(),
    ]
})
export class ManagerModule { }
