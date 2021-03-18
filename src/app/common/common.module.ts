import {NgModule} from '@angular/core';
import {SanitizeHtmlPipe} from '../services';
import {SanitizeResourcePipe} from '../services/sanitizeResource.pipe';
import {SanitizeUrlPipe} from '../services/sanitizeUrl.pipe';


@NgModule({
    declarations: [SanitizeHtmlPipe, SanitizeResourcePipe, SanitizeUrlPipe, SanitizeHtmlPipe],
  imports: [],
    exports: [
        SanitizeHtmlPipe,
        SanitizeResourcePipe,
        SanitizeUrlPipe,
        SanitizeHtmlPipe
    ]
})
export class MyCommonModule {
}
