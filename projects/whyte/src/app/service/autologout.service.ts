import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthService} from './auth.service';
import {DataService} from './data.service';

const MINUTES_UNITL_AUTO_LOGOUT = 30; // in min
const CHECK_INTERVAL = 5 * 60000; // in ms
const TOKEN_RENEW_TIME = 15 * 60000;

@Injectable()
export class AutoLogoutService {

  constructor(private router: Router,
              private dataStore: DataService,
              private authService: AuthService) {

    this.dataStore.setAction(Date.now());
    this.initListener();
    this.check();
    this.initInterval();
  }

  public getLastAction() {
    return this.dataStore.getAction();
  }

  public setLastAction(lastAction: number) {
    this.dataStore.setAction(lastAction);
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    // document.body.addEventListener('mouseover', () => this.reset());
    // document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const token = this.dataStore.getToken();
    if (token) {
      const jwtHelper: JwtHelperService = new JwtHelperService();

      const now = Date.now();
      const timeLeft = this.getLastAction() + (MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000);
      const diff = timeLeft - now;
      const isTimeout = diff < 0;
      // this.authService.renewToken();

      if (isTimeout) {
        this.logout();
      } else if (!jwtHelper.isTokenExpired(token)) {
        const exp = jwtHelper.getTokenExpirationDate(token);
        const diffToken = exp.getTime() - (Date.now() + TOKEN_RENEW_TIME);

        if (diffToken < 0) {
          this.authService.renewToken();
        }
      }
    }
  }

  logout() {
    this.dataStore.logout();
    this.router.navigate(['/login']);
  }
}
