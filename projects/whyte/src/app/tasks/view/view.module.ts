import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import {MyCommonModule} from "../../../../../../src/app/common/common.module";
import {CustomPipe} from "../../service/custom.pipe";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {DataModule} from "../data/data.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";



@NgModule({
    declarations: [ViewComponent],
    exports: [
        ViewComponent
    ],
    imports: [
        CommonModule,
        MyCommonModule,
        CustomPipe,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        BsDropdownModule,
        TooltipModule.forRoot(),
        MatSelectModule,
        DataModule,
        MatProgressSpinnerModule
    ]
})
export class ViewModule { }
