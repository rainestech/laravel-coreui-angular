import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import {ContentLoaderModule} from "@ngneat/content-loader";
import {NgxPaginationModule} from "ngx-pagination";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {DataModule} from "../data/data.module";

@NgModule({
    declarations: [ViewComponent],
    exports: [
        ViewComponent
    ],
    imports: [
        CommonModule,
        ContentLoaderModule,
        NgxPaginationModule,
        BsDropdownModule,
        TooltipModule.forRoot(),
        DataModule
    ]
})
export class ViewModule { }
