import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {HttpClientModule} from '@angular/common/http';
import {ConfirmationService} from 'primeng/api';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {JournalComponent} from './journal.component';
import {ModalModule} from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [JournalComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    TableModule,
    InputTextModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
      ModalModule.forChild()
  ],
  exports: [
    JournalComponent
  ],
  providers: [
    DatePipe,
    ConfirmationService]
})
export class EntriesModule {
}
