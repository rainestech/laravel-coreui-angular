import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataComponent} from './data.component';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {PaymentComponent} from './payment.component';


@NgModule({
  declarations: [DataComponent, PaymentComponent],
  exports: [
    DataComponent
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule
  ]
})
export class DataModule {
}
