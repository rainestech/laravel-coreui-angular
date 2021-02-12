import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {P404Component} from "./admin/404.component";
import {P500Component} from "./admin/500.component";
import {LoginComponent} from "./admin/login/login.component";
import {ResetComponent} from "./admin/reset/reset.component";
import {RegisterComponent} from "./admin/register/register.component";
import {DefaultLayoutComponent} from "./containers/default-layout";

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
    path: 'auth_reset',
    component: ResetComponent,
    data: {
      title: 'Reset Password'
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
    // canActivate: [AuthGuard],
    data: {
      title: 'Portal'
    },
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'forum',
        loadChildren: () => import('./forum/forum.module').then(m => m.ForumModule)
      },
    ]
  },
  {path: '**', component: P404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouting { }
