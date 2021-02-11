import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Search'
    },
    children: [
      {
        path: '',
        component: SearchComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];


@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SearchModule { }
