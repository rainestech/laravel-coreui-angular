import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {MomentUtcDateAdapter} from '../../services';
import {ProfileComponent} from './profile.component';
import {StorageModule} from '../../storage/storage.module';
import {ConfirmationService, SharedModule} from 'primeng/api';
import {TableModule} from 'primeng/table';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    StorageModule,
    SharedModule,
    TableModule,
  ],
  exports: [
    ProfileComponent
  ],
  providers: [
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
    ConfirmationService
  ]
})
export class UserProfileModule {
}
