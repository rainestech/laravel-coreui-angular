import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import {ContentLoaderModule} from "@ngneat/content-loader";
import {MyCommonModule} from "../../../../../../src/app/common/common.module";



@NgModule({
    declarations: [ViewComponent],
    exports: [
        ViewComponent
    ],
    imports: [
        CommonModule,
        ContentLoaderModule,
        MyCommonModule
    ]
})
export class ViewModule { }
