import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Import Containers
import {DefaultLayoutComponent} from './containers';
import {P404Component} from "./admin/404.component";
import {P500Component} from "./admin/500.component";
import {LoginComponent} from "./admin/login/login.component";
import {RegisterComponent} from "./admin/register/register.component";
import {ResetComponent} from "./admin/reset/reset.component";
import {ContactComponent} from "./admin/contact/contact.component";
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
    path: 'password_reset',
    component: ResetComponent,
    data: {
      title: 'Change Password'
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
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'Contact Admin'
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
        path: 'admin',
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'docs',
        loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
      },
      {
        path: 'profile-options',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
      },
      {
        path: 'shortlist',
        loadChildren: () => import('./shortlist/shortlist.module').then(m => m.ShortlistModule)
      },
      {
        path: 'tokens',
        loadChildren: () => import('./tokens/tokens.module').then(m => m.TokensModule)
      },
      {
        path: 'api-docs',
        loadChildren: () => import('./api-docs/api-docs.module').then(m => m.ApiDocsModule)
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
