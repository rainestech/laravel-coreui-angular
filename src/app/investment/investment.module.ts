import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentComponent } from './investment.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {DetailModule} from '../members/details/detail.module';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';



@NgModule({
  declarations: [InvestmentComponent],
  exports: [
    InvestmentComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    TabsModule,
    DetailModule
  ]
})
export class InvestmentModule { }
