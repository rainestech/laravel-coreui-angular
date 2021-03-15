import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import {ContentLoaderModule} from "@ngneat/content-loader";
import {MyCommonModule} from "../../../../../../src/app/common/common.module";
import {CandidateProfileModule} from "../candidate/candidate-profile.module";
import {RecruiterProfileModule} from "../recruiter/recruiter-profile.module";



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
        RecruiterProfileModule
    ]
})
export class ViewModule { }
