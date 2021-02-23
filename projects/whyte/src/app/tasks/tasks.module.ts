import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import {RouterModule, Routes} from "@angular/router";
import {CallsComponent} from "../calls/calls.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {MatInputModule} from "@angular/material/input";

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
        MatFormFieldModule,
        ReactiveFormsModule,
        DragDropModule,
        TooltipModule.forRoot(),
        BsDropdownModule,
        MatInputModule
    ]
})
export class TasksModule { }
