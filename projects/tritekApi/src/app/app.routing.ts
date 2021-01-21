import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Import Containers
import {DefaultLayoutComponent} from './containers';
import {P404Component} from '../../../../src/app/error/404.component';
import {P500Component} from '../../../../src/app/error/500.component';
import {LoginComponent} from '../../../../src/app/admin/login/login.component';
import {VerifyComponent} from '../../../../src/app/admin/verify/verify.component';
import {RegisterComponent} from '../../../../src/app/admin/register/register.component';
import {AuthGuard} from '../../../../src/app/services';


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
      title: 'Portal'
    },
    children: [
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      // },
      {
        path: 'admin',
        loadChildren: () => import('../../../../src/app/admin/users.module').then(m => m.UsersModule)
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
