import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {MomentUtcDateAdapter} from '../../services';
import {DetailComponent} from './detail.component';
import {StorageModule} from '../../storage/storage.module';
import {ConfirmationService} from 'primeng/api';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    StorageModule
  ],
  exports: [
    DetailComponent
  ],
  providers: [
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
    ConfirmationService
  ]
})
export class DetailModule {
}
