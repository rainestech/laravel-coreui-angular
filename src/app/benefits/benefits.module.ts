import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BenefitsComponent } from './benefits.component';
import {InputTextModule} from 'primeng/inputtext';
import {BrowserModule} from '@angular/platform-browser';
import {DetailModule} from '../members/details/detail.module';
import {TableModule} from 'primeng/table';



@NgModule({
  declarations: [BenefitsComponent],
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    DetailModule
  ],
  exports: [BenefitsComponent]
})
export class BenefitsModule { }
