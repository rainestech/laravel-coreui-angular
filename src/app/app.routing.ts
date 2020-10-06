import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Import Containers
import {DefaultLayoutComponent} from './containers';

import {LoginComponent} from './admin/login/login.component';
import {RegisterComponent} from './admin/register/register.component';
import {VerifyComponent} from './admin/verify/verify.component';
import {AuthGuard} from './services';
import {P404Component} from './error/404.component';
import {P500Component} from './error/500.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'password_reset',
    component: VerifyComponent,
    data: {
      title: 'Change Password'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/users.module').then(m => m.UsersModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'subs',
        loadChildren: () => import('./contributions/contributions.module').then(m => m.ContributionsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'banking',
        loadChildren: () => import('./banking/banking.module').then(m => m.BankingModule)
      },
      {
        path: 'members',
        loadChildren: () => import('./members/employees.module').then(m => m.EmployeesModule)
      },
    ]
  },
  {path: '**', component: P404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
