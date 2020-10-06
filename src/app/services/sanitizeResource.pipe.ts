import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeResource'
})

export class SanitizeResourcePipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) {
  }

  transform(value: any): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
