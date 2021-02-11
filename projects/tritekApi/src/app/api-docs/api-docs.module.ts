import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDocsComponent } from './api-docs.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'API Documentation'
    },
    children: [
      {
        path: '',
        component: ApiDocsComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];


@NgModule({
  declarations: [ApiDocsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ApiDocsModule { }
