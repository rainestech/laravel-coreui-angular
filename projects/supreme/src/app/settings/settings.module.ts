import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import {RouterModule, Routes} from "@angular/router";
import {RecruiterProfileModule} from "../profile/recruiter/recruiter-profile.module";
import {CandidateProfileModule} from "../profile/candidate/candidate-profile.module";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile Settings'
    },
    children: [
      {
        path: '',
        component: SettingsComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];


@NgModule({
  declarations: [SettingsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        RecruiterProfileModule,
        CandidateProfileModule
    ]
})
export class SettingsModule { }
