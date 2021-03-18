import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TokensComponent} from "./tokens.component";
import {RouterModule, Routes} from "@angular/router";
import {MyCommonModule} from "../../../../../src/app/common/common.module";
import {DraftsComponent} from "./snippets/drafts.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {TableModule} from "primeng/table";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'API Token'
    },
    children: [
      {
        path: '',
        component: TokensComponent,
        data: {
          title: ''
        },
      },
      {
        path: 'draft',
        component: DraftsComponent,
        data: {
          title: 'Draft'
        },
      },
    ]
  }
];


@NgModule({
  declarations: [TokensComponent, DraftsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MyCommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    CKEditorModule,
    TableModule
  ]
})
export class TokensModule { }
