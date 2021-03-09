import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComponent } from './data.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ContentLoaderModule} from "@ngneat/content-loader";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";



@NgModule({
    declarations: [DataComponent],
    exports: [
        DataComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        ContentLoaderModule,
        TableModule,
        InputTextModule
    ]
})
export class DataModule { }
