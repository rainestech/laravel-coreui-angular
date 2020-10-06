import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {MomentUtcDateAdapter} from '../../services';
import {PaymentLogsComponent} from './payment.logs.component';
import {StorageModule} from '../../storage/storage.module';
import {DetailModule} from '../../members/details/detail.module';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmationService} from 'primeng/api';

@NgModule({
  declarations: [PaymentLogsComponent],
  imports: [
    CommonModule,
    StorageModule,
    DetailModule,
    TableModule,
    InputTextModule
  ],
  exports: [
    PaymentLogsComponent
  ],
  providers: [
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
    ConfirmationService
  ]
})
export class PaymentLogsModule {
}
