import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TokensComponent} from "./tokens.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'API Token'
    },
    children: [
      {
        path: '',
        component: TokensComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];


@NgModule({
  declarations: [TokensComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TokensModule { }
