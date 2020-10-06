import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {EmployeesComponent} from './employees.component';
import {SearchComponent} from './search/search.component';
import {EditComponent} from './edit/edit.component';
import {RouterModule, Routes} from '@angular/router';
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
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {MomentUtcDateAdapter} from '../services';
import {DataModule} from './data/data.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmationService} from 'primeng/api';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Personal Data'
    },
    children: [
      {
        path: 'add',
        component: EmployeesComponent,
        data: {
          title: 'Add/Register New Member'
        }
      },
      {
        path: 'update',
        component: EditComponent,
        data: {
          title: 'Update/Edit Member Data'
        }
      },
      {
        path: 'data',
        component: SearchComponent,
        data: {
          title: 'Members Data'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [EmployeesComponent, SearchComponent, EditComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
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
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ConfirmDialogModule,
    MatButtonModule,
    InputTextModule,
    DataModule
  ],
  providers: [
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'en-NG'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
    ConfirmationService
  ]
})
export class EmployeesModule {
}
