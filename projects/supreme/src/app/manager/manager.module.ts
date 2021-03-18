import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerComponent } from './manager.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { RecruitersComponent } from './recruiters/recruiters.component';
import { ReportsComponent } from './reports/reports.component';
import {RouterModule, Routes} from "@angular/router";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {TableModule} from "primeng/table";
import {ContentLoaderModule} from "@ngneat/content-loader";
import {ViewModule} from "../profile/view/view.module";
import {RecruiterProfileModule} from "../profile/recruiter/recruiter-profile.module";
import { UsersComponent } from './users/users.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ModalModule} from "ngx-bootstrap/modal";
import {CandidateProfileModule} from "../profile/candidate/candidate-profile.module";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {DashboardModule} from "../dashboard/dashboard.module";

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
        component: UsersComponent,
        data: {
          title: 'Manage Users'
        },
      },
      {
        path: 'candidates',
        component: CandidatesComponent,
        data: {
          title: 'Manage Candidates'
        },
      },
      {
        path: 'recruiters',
        component: RecruitersComponent,
        data: {
          title: 'Manage Recruiters'
        },
      },
      {
        path: 'report',
        component: ReportsComponent,
        data: {
          title: 'Platform Reports'
        },
      },
    ]
  }
];

@NgModule({
  declarations: [ManagerComponent, CandidatesComponent, RecruitersComponent, ReportsComponent, UsersComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BsDropdownModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        TableModule,
        ContentLoaderModule,
        ViewModule,
        RecruiterProfileModule,
        ConfirmDialogModule,
        ModalModule.forChild(),
        CandidateProfileModule,
        TooltipModule.forRoot(),
        DashboardModule
    ]
})
export class ManagerModule { }
