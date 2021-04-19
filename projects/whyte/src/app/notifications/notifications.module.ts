import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemplatesComponent} from './email/templates.component';
import {ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {ModalModule} from 'ngx-bootstrap/modal';
import {RouterModule, Routes} from '@angular/router';
import {SmsComponent} from './sms/sms.component';
import {ConfirmationService} from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {MomentUtcDateAdapter} from "../../../../../src/app/services";

const route: Routes = [
  {
    path: 'email',
    component: TemplatesComponent,
    data: {
      title: 'Mail Templates'
    }
  },
  {
    path: '',
    component: TemplatesComponent,
    data: {
      title: 'Mail Templates'
    }
  },
  {
    path: 'short_msgs',
    component: SmsComponent,
    data: {
      title: 'Short Messages'
    }
  },
];

@NgModule({
  declarations: [TemplatesComponent, SmsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    TableModule,
    InputTextModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
  ],
  providers: [ConfirmationService,
    {provide: MAT_DATE_LOCALE, useValue: 'en-NG'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
  ]
})
export class NotificationsModule {
}
