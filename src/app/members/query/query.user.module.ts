import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {MomentUtcDateAdapter} from '../../services';
import {QueryUserComponent} from './query.user.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ConfirmationService} from 'primeng/api';

@NgModule({
  declarations: [QueryUserComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDropdownModule,
  ],
  exports: [
    QueryUserComponent
  ],
  providers: [
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
    ConfirmationService
  ]
})
export class QueryUserModule {
}
