import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {DataComponent} from './data.component';
import {MomentUtcDateAdapter} from '../../services';
import {StorageModule} from '../../storage/storage.module';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  declarations: [DataComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatStepperModule,
    MatInputModule,
    TableModule,
    ToastModule,
    TabsModule,
    MatGridListModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
    ConfirmDialogModule,
    MatButtonModule,
    InputTextModule,
    StorageModule
  ],
  exports: [
    DataComponent
  ],
  providers: [
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
    ConfirmationService
  ]
})
export class DataModule {
}
