import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadsComponent} from './uploads.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {StorageDataService} from './storage.data.service';
import {MyCommonModule} from '../common/common.module';


@NgModule({
  declarations: [UploadsComponent],
  exports: [
    UploadsComponent
  ],
  imports: [
    CommonModule,
    MyCommonModule,
    ModalModule.forRoot()
  ],
  providers: [
    StorageDataService
  ]
})
export class StorageModule {
}
