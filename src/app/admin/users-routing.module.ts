import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './users.component';
import {RolesComponent} from './roles/roles.component';
import {PrivilegeComponent} from './privilege/privilege.component';
import {TenantsComponent} from './tenants/tenants.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: '',
        component: UsersComponent,
        data: {
          title: 'Users'
        },
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Users'
        },
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          title: 'Roles'
        }
      },
      {
        path: 'access',
        component: PrivilegeComponent,
        data: {
          title: 'Access Control'
        }
      },
      {
        path: 'tenants',
        component: TenantsComponent,
        data: {
          title: 'Tenants Management'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsersRoutingModule {
}
