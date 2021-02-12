import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile'
    },
    children: [
      {
        path: '',
        component: DocsComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [DocsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DocsModule { }
