import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import {RouterModule, Routes} from "@angular/router";
import {MyCommonModule} from "../../../../../src/app/common/common.module";
import {ContentLoaderModule} from "@ngneat/content-loader";
import {ViewModule} from "./view/view.module";

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
        MyCommonModule,
        ContentLoaderModule,
        ViewModule
    ]
})
export class ProfileModule { }
