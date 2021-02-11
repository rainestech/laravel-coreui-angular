import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortlistComponent } from './shortlist.component';
import {Router, RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Chat'
    },
    children: [
      {
        path: '',
        component: ShortlistComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];


@NgModule({
  declarations: [ShortlistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ShortlistModule { }
