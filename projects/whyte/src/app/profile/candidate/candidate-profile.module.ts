import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateProfileComponent } from './candidate-profile.component';
import {ReactiveFormsModule} from "@angular/forms";
import {StorageModule} from "../../storage/storage.module";
import {MatInputModule} from "@angular/material/input";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {ContentLoaderModule} from "@ngneat/content-loader";



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
    ContentLoaderModule
  ]
})
export class CandidateProfileModule { }
