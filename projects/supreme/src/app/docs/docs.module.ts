import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs.component';
import {RouterModule, Routes} from "@angular/router";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile'
    },
    children: [
      {
        path: '',
        component: DocsComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [DocsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TooltipModule.forRoot(),
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class DocsModule { }
