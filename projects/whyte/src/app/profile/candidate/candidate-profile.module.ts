import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateProfileComponent } from './candidate-profile.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {ContentLoaderModule} from "@ngneat/content-loader";
import {TagInputModule} from "ngx-chips";
import {StorageModule} from "../../storage/storage.module";



@NgModule({
  declarations: [CandidateProfileComponent],
  exports: [
    CandidateProfileComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        StorageModule,
        MatInputModule,
        CKEditorModule,
        ContentLoaderModule,
        TagInputModule,
        FormsModule
    ]
})
export class CandidateProfileModule { }
