import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContributionsComponent} from './contributions.component';
import {PaymentsComponent} from './payments/payments.component';
import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {QueryUserModule} from '../members/query/query.user.module';
import {DataModule} from './data/data.module';
import {RouterModule, Routes} from '@angular/router';
import {TransferComponent} from './transfer/transfer.component';
import {MyAccountModule} from '../profile/account/my.account.module';
import {PaymentLogsModule} from '../profile/payment-logs/payment.logs.module';
import {PaymentDetailsModule} from './payment-details/payment-details.module';
import {BenefitsComponent} from './benefits/benefits.component';
import {BenefitsModule} from '../benefits/benefits.module';
import { InvestmentsComponent } from './investments/investments.component';
import {InvestmentModule} from '../investment/investment.module';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Contributions'
    },
    children: [
      {
        path: 'create',
        component: AddComponent,
        data: {
          title: 'New Subscription'
        }
      },
      {
        path: 'edit',
        component: EditComponent,
        data: {
          title: 'Edit Subscription'
        }
      },
      {
        path: 'accounts',
        component: ContributionsComponent,
        data: {
          title: 'Members Account'
        }
      },
      {
        path: 'transfer',
        component: TransferComponent,
        data: {
          title: 'Members Account'
        }
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        data: {
          title: 'Payments'
        }
      },
      {
        path: 'benefits',
        component: BenefitsComponent,
        data: {
          title: 'Benefits'
        }
      },
      {
        path: 'investments',
        component: InvestmentsComponent,
        data: {
          title: 'Investments'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [ContributionsComponent, PaymentsComponent, EditComponent, AddComponent,
    TransferComponent, BenefitsComponent, InvestmentsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    BsDropdownModule,
    QueryUserModule,
    DataModule,
    TableModule,
    ConfirmDialogModule,
    InputTextModule,
    MyAccountModule,
    PaymentLogsModule,
    PaymentDetailsModule,
    BenefitsModule,
    InvestmentModule,
  ]
})
export class ContributionsModule {
}
