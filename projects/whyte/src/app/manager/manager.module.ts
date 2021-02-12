import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerComponent } from './manager.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { RecruitersComponent } from './recruiters/recruiters.component';
import { ReportsComponent } from './reports/reports.component';
import {RouterModule, Routes} from "@angular/router";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";

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
  declarations: [ManagerComponent, CandidatesComponent, RecruitersComponent, ReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BsDropdownModule
  ]
})
export class ManagerModule { }
