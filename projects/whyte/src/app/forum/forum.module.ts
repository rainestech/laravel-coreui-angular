import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumComponent } from './forum.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Chat'
    },
    children: [
      {
        path: '',
        component: ForumComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];


@NgModule({
  declarations: [ForumComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ForumModule { }
