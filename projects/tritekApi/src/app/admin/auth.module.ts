import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MomentUtcDateAdapter} from '../services';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {VerifyComponent} from './verify/verify.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {P404Component} from '../error/404.component';
import {P500Component} from '../error/500.component';
import {ResetRequestComponent} from './login/reset-request.component';

@NgModule({
  declarations: [LoginComponent,
    RegisterComponent,
    VerifyComponent,
    P404Component,
    P500Component,
    ResetRequestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-NG'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentUtcDateAdapter},
  ]
})

export class AuthModule {
}
