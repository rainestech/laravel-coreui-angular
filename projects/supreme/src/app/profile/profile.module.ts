import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import {RouterModule, Routes} from "@angular/router";
import {RecruiterProfileModule} from "./recruiter/recruiter-profile.module";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile'
    },
    children: [
      {
        path: '',
        component: ProfileComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [ProfileComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        RecruiterProfileModule
    ]
})
export class ProfileModule { }
