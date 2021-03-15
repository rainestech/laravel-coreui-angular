import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {RouterModule, Routes} from "@angular/router";
import {TagInputModule} from "ngx-chips";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxMatTagInputModule} from "ngx-mat-tag-input";
import {ContentLoaderModule} from "@ngneat/content-loader";
import {StorageModule} from "../storage/storage.module";
import {MyCommonModule} from "../../../../../src/app/common/common.module";
import {ViewModule} from "../profile/view/view.module";
import {TooltipModule} from "ngx-bootstrap/tooltip";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Search'
    },
    children: [
      {
        path: '',
        component: SearchComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];


@NgModule({
  declarations: [SearchComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TagInputModule,
        ReactiveFormsModule,
        NgxMatTagInputModule,
        ContentLoaderModule,
        StorageModule,
        MyCommonModule,
        ViewModule,
        TooltipModule.forRoot()
    ]
})
export class SearchModule { }
