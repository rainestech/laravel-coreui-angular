import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<ngx-loading-bar [color]="\'green\'" [includeSpinner]="false"></ngx-loading-bar>' +
      '<router-outlet></router-outlet><p-toast [baseZIndex]="10000"></p-toast>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
