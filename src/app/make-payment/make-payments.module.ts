import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MakePaymentComponent} from './make-payment.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {Angular4PaystackModule} from 'angular4-paystack';

@NgModule({
  declarations: [MakePaymentComponent],
  exports: [
    MakePaymentComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TooltipModule.forRoot(),
        Angular4PaystackModule.forRoot('pk_test_1c5cf86ea36120ef67aee315df87d280916bf069'),
    ]
})
export class MakePaymentsModule { }
