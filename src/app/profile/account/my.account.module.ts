import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {MomentUtcDateAdapter} from '../../services';
import {MyAccountComponent} from './my.account.component';
import {StorageModule} from '../../storage/storage.module';
import {DetailModule} from '../../members/details/detail.module';
import {InvestmentModule} from '../../investment/investment.module';
import {BenefitsModule} from '../../benefits/benefits.module';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmationService} from 'primeng/api';

@NgModule({
  declarations: [MyAccountComponent],
  imports: [
    CommonModule,
    StorageModule,
    DetailModule,
    TableModule,
    InputTextModule,
    InvestmentModule,
    BenefitsModule
  ],
  exports: [
    MyAccountComponent
  ],
  providers: [
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
    ConfirmationService
  ]
})
export class MyAccountModule {
}
