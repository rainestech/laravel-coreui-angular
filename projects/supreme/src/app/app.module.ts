import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AppComponent} from './app.component';
// Import containers
import {DefaultLayoutComponent} from './containers';
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
// Import routing module
import {AppRoutingModule} from './app.routing';
// Import 3rd party components
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ChartsModule} from 'ng2-charts';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MyCommonModule} from '../../../../src/app/common/common.module';
import {LoginComponent} from "./admin/login/login.component";
import {RegisterComponent} from "./admin/register/register.component";
import {ResetComponent} from "./admin/reset/reset.component";
import {ContentLoaderModule} from "@ngneat/content-loader";
import {ContactComponent} from "./admin/contact/contact.component";
import {DataService} from "./service/data.service";
import {TokenInterceptor} from "./service/token.interceptor";
import {AutoLogoutService} from "./service/autologout.service";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    LoadingBarHttpClientModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    ToastModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ConfirmDialogModule,
    MyCommonModule,
    ContentLoaderModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ResetComponent,
    RegisterComponent,
    ContactComponent,
    ...APP_CONTAINERS,
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    DataService,
    MessageService,
    AutoLogoutService,
    ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
