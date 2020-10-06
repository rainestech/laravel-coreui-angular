import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TypeComponent} from './subscription/type.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {AccountClassComponent} from './cashbook/account-class.component';
import {AccountTypeComponent} from './cashbook/account-type.component';
import {NominalAccountComponent} from './cashbook/nominal-account.component';
import {BanksComponent} from './banks/banks.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AccountsComponent} from './cashbook/accounts/accounts.component';
import {BenefitsComponent} from './benefits/benefits.component';
import {InvestmentComponent} from './investment/investment.component';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {BudgetComponent} from './cashbook/budget/budget.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Settings'
    },
    children: [
      {
        path: 'subscriptions',
        component: TypeComponent,
        data: {
          title: 'Subscription Type'
        }
      },
      {
        path: 'benefits',
        component: BenefitsComponent,
        data: {
          title: 'Benefit Type'
        }
      },
      {
        path: 'investment',
        component: InvestmentComponent,
        data: {
          title: 'Benefit Type'
        }
      },
      {
        path: 'account/bank_accounts',
        component: AccountsComponent,
        data: {
          title: 'Banks'
        }
      },
      {
        path: 'account/acc-cat',
        component: AccountClassComponent,
        data: {
          title: 'Account Category'
        }
      },
      {
        path: 'account/acc-chart',
        component: AccountTypeComponent,
        data: {
          title: 'Account Charts'
        }
      },
      {
        path: 'account/nominal',
        component: NominalAccountComponent,
        data: {
          title: 'Nominal Accounts'
        }
      },
      {
        path: 'account/budget',
        component: BudgetComponent,
        data: {
          title: 'Budget Manager'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [TypeComponent,
    AccountClassComponent,
    AccountTypeComponent,
    NominalAccountComponent,
    BanksComponent,
    AccountsComponent,
    BenefitsComponent,
    BudgetComponent,
    InvestmentComponent],
  exports: [
    InvestmentComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    RouterModule.forChild(routes),
    InputTextModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    ConfirmDialogModule,
    TableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ]
})
export class SettingsModule {
}
