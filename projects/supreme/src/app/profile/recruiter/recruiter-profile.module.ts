import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruiterProfileComponent } from './recruiter-profile.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {StorageModule} from "../../storage/storage.module";
import {ContentLoaderModule} from "@ngneat/content-loader";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [RecruiterProfileComponent],
  exports: [
    RecruiterProfileComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        CKEditorModule,
        StorageModule,
        ContentLoaderModule,
        MatSelectModule
    ]
})
export class RecruiterProfileModule { }
