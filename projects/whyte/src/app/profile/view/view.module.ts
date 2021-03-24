import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import {ContentLoaderModule} from "@ngneat/content-loader";
import {MyCommonModule} from "../../../../../../src/app/common/common.module";
import {CandidateProfileModule} from "../candidate/candidate-profile.module";
import {TooltipModule} from "ngx-bootstrap/tooltip";



@NgModule({
    declarations: [ViewComponent],
    exports: [
        ViewComponent
    ],
    imports: [
        CommonModule,
        ContentLoaderModule,
        MyCommonModule,
        CandidateProfileModule,
        TooltipModule.forRoot()
    ]
})
export class ViewModule { }
