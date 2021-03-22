import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {StorageModule} from "../storage/storage.module";
import {MyCommonModule} from "../../../../../src/app/common/common.module";
import {TableModule} from "primeng/table";
import {TooltipModule} from "ngx-bootstrap/tooltip";



@NgModule({
    declarations: [DashboardComponent],
    exports: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        StorageModule,
        MyCommonModule,
        TableModule,
        TooltipModule.forRoot(),
    ]
})
export class DashboardModule { }
