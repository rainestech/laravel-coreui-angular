import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat2Component } from './chat2.component';
import {RouterModule, Routes} from "@angular/router";
import {TabsModule} from "ngx-bootstrap/tabs";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Chat'
    },
    children: [
      {
        path: '',
        component: Chat2Component,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [Chat2Component],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TabsModule
    ]
})
export class Chat2Module { }
