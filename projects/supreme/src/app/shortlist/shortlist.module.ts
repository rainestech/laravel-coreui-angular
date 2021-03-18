import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortlistComponent } from './shortlist.component';
import {Router, RouterModule, Routes} from "@angular/router";
import {StorageModule} from "../storage/storage.module";
import {MyCommonModule} from "../../../../../src/app/common/common.module";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {ViewModule} from "../profile/view/view.module";
import {ReactiveFormsModule} from "@angular/forms";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Chat'
    },
    children: [
      {
        path: '',
        component: ShortlistComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];


@NgModule({
  declarations: [ShortlistComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        StorageModule,
        MyCommonModule,
        TooltipModule.forRoot(),
        ViewModule,
        ReactiveFormsModule,
        BsDropdownModule
    ]
})
export class ShortlistModule { }
