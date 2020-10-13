import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {AccountsComponent} from './accounts/accounts.component';
import {DetailModule} from '../members/details/detail.module';
import {RouterModule, Routes} from '@angular/router';
import {UserProfileModule} from '../admin/profile/user.profile.module';
import {MyAccountModule} from './account/my.account.module';
import {PaymentLogsModule} from './payment-logs/payment.logs.module';
import {DataModule} from '../members/data/data.module';
import {MakePaymentsModule} from '../make-payment/make-payments.module';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile'
    },
    children: [
      {
        path: '',
        component: ProfileComponent,
        data: {
          title: 'My Profile'
        }
      },
      {
        path: 'my',
        component: ProfileComponent,
        data: {
          title: 'My Profile'
        }
      },
      {
        path: 'account',
        component: AccountsComponent,
        data: {
          title: 'My Account'
        }
      },
      {
        path: 'correspondence',
        component: ProfileComponent,
        data: {
          title: 'Members Data'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [ProfileComponent, AccountsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DetailModule,
    UserProfileModule,
    MyAccountModule,
    PaymentLogsModule,
    DataModule,
    MakePaymentsModule,
  ]
})
export class ProfileModule {
}
