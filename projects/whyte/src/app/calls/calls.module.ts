import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsComponent } from './calls.component';
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
        component: CallsComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [CallsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TabsModule
    ]
})
export class CallsModule { }
