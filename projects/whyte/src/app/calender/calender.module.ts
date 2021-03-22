import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalenderComponent } from './calender.component';
import {RouterModule, Routes} from "@angular/router";
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MyCommonModule} from "../../../../../src/app/common/common.module";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {CustomPipe} from "../service/custom.pipe";
import {ModalModule} from "ngx-bootstrap/modal";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner"; // a plugin

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Calender'
    },
    children: [
      {
        path: '',
        component: CalenderComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [CalenderComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FullCalendarModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MyCommonModule,
        MatInputModule,
        ModalModule.forRoot(),
        MatDatepickerModule,
        CKEditorModule,
        CustomPipe,
        MatProgressSpinnerModule
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})
export class CalenderModule { }
