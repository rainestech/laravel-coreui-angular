import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {P404Component} from "./admin/404.component";
import {P500Component} from "./admin/500.component";
import {LoginComponent} from "./admin/login/login.component";
import {ResetComponent} from "./admin/reset/reset.component";
import {RegisterComponent} from "./admin/register/register.component";
import {DefaultLayoutComponent} from "./containers/default-layout";
import {AuthGuard} from "./service/auth.guard";

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
    canActivate: [AuthGuard],
    data: {
      title: 'Portal'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule)
      },
      {
        path: 'channels',
        loadChildren: () => import('./channels/channels.module').then(m => m.ChannelsModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('./calender/calender.module').then(m => m.CalenderModule)
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
      },
      {
        path: 'call',
        loadChildren: () => import('./calls/calls.module').then(m => m.CallsModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./chat2/chat2.module').then(m => m.Chat2Module)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'profile-options',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
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
