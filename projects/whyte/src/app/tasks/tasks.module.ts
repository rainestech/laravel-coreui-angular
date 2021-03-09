import { NgModule } from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import { TasksComponent } from './tasks.component';
import {RouterModule, Routes} from "@angular/router";
import {CallsComponent} from "../calls/calls.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {MatInputModule} from "@angular/material/input";
import {ModalModule} from "ngx-bootstrap/modal";
import {MatSelectModule} from "@angular/material/select";
import {ViewModule} from "./view/view.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "../service/token.interceptor";
import {MAT_DATE_LOCALE} from "@angular/material/core";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tasks'
    },
    children: [
      {
        path: '',
        component: TasksComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [TasksComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ModalModule.forChild(),
        MatFormFieldModule,
        ReactiveFormsModule,
        DragDropModule,
        TooltipModule.forRoot(),
        BsDropdownModule,
        MatInputModule,
        MatSelectModule,
        ViewModule,
        MatDatepickerModule
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})
export class TasksModule { }
