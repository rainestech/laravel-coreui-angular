import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsComponent } from './channels.component';
import {RouterModule, Routes} from "@angular/router";
import {CallsComponent} from "../calls/calls.component";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Channels'
    },
    children: [
      {
        path: '',
        component: ChannelsComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [ChannelsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BsDropdownModule
  ]
})
export class ChannelsModule { }
