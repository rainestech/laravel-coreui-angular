import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat2Component } from './chat2.component';
import {RouterModule, Routes} from "@angular/router";
import {TabsModule} from "ngx-bootstrap/tabs";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {AngularFireModule} from "@angular/fire";
import {environment} from "../../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {ReactiveFormsModule} from "@angular/forms";
import {CustomPipe} from "../service/custom.pipe";
import {ModalModule} from "ngx-bootstrap/modal";

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
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        TabsModule,
        BsDropdownModule,
        ModalModule.forChild(),
        ReactiveFormsModule,
        CustomPipe
    ]
})
export class Chat2Module { }
