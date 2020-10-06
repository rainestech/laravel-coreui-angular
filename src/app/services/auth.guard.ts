import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  // currentUser;
  token: string;
  roles;

  constructor(private router: Router, private dataStore: DataService) {
    // this.jwtHelper = new JwtHelper();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.token = this.dataStore.getToken();
    // this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    // this.roles = JSON.parse(sessionStorage.getItem('roles'));

    const jwtHelper: JwtHelperService = new JwtHelperService();
    // console.log('AuthGuard: Token is expired: ' + jwtHelper.isTokenExpired(this.token));
    if (this.token && !jwtHelper.isTokenExpired(this.token)) {
      return true;
    } else {
      return this.refreshToken(state);
    }
  }

  // not logged in so redirect to login page
  refreshToken(state: RouterStateSnapshot) {
    return this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}})
      .then(nav => {
        return nav;
      });
  }
}
