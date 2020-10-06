import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaymentDetailsComponent} from './payment-details.component';
import {DetailModule} from '../../members/details/detail.module';


@NgModule({
  declarations: [PaymentDetailsComponent],
  exports: [
    PaymentDetailsComponent
  ],
  imports: [
    CommonModule,
    DetailModule
  ]
})
export class PaymentDetailsModule {
}
