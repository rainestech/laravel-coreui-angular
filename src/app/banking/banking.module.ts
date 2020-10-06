import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {OpenComponent} from './open/open.component';
import {TransfersComponent} from './transfers/transfers.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {ReconciliationComponent} from './reconciliation/reconciliation.component';
import {RouterModule, Routes} from '@angular/router';
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
import {NewTxComponent } from './new-tx/new-tx.component';
import {EntriesModule} from './entries/entries.module';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Banking'
    },
    children: [
      {
        path: '',
        component: TransactionsComponent,
        data: {
          title: 'Transactions'
        }
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        data: {
          title: 'Transactions'
        }
      },
      {
        path: 'accounts',
        component: OpenComponent,
        data: {
          title: 'Opening Balance'
        }
      },
      {
        path: 'transfers',
        component: TransfersComponent,
        data: {
          title: 'Transfers'
        }
      },
      {
        path: 'reconciliation',
        component: ReconciliationComponent,
        data: {
          title: 'Reconciliations'
        }
      },
      {
        path: 'new_tx',
        component: NewTxComponent,
        data: {
          title: 'New Transaction'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [OpenComponent, TransfersComponent, TransactionsComponent, ReconciliationComponent, NewTxComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ConfirmDialogModule,
        TableModule,
        InputTextModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        EntriesModule,
    ],
  providers: [
    DatePipe,
    ConfirmationService]
})
export class BankingModule {
}
