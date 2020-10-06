import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {Endpoints} from '../endpoints';
import {DataService} from './data.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {PasswordReset, User} from '../admin/users.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  public currentUser: Observable<User> = this.currentUserSubject.asObservable();
  private apiUrl = Endpoints.mainUrl + Endpoints.adminApi + '/users';

  constructor(private http: HttpClient, private dataStore: DataService, private router: Router) {
  }

  login(username: string, password: string) {
    return this.http.post<User>(this.apiUrl + '/login', {username: username, password: password})
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user) {
          this.dataStore.setUser(user);
          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }

  logout(nav = false) {
    // remove user from local storage to log user out
    if (this.tokenExpired() && !nav) {
      this.dataStore.logout();
      this.currentUserSubject.next(null);
    } else {
      this.http.get(this.apiUrl + '/logout').pipe(map(res => res)).pipe(first()).subscribe(s => {
        this.dataStore.logout();
        this.currentUserSubject.next(null);

        if (nav) {
          this.router.navigate(['/login']);
        }
      }, error => {
        this.dataStore.logout();
        this.currentUserSubject.next(null);

        if (nav) {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  tokenExpired(): boolean {
    const jwtHelper: JwtHelperService = new JwtHelperService();
    if (jwtHelper.isTokenExpired(this.dataStore.getToken())) {
      this.dataStore.logout();
      return true;
    }

    return false;
  }

  resetPassword(data: PasswordReset) {
    return this.http.post<any>(this.apiUrl + '/reset', data)
      .pipe(map(user => {
        return user;
      }));
  }

  renewToken() {
    const oldToken = this.dataStore.getToken();
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    if (oldToken) {
      this.http.post<string>(this.apiUrl + '/renew', oldToken, {headers, responseType: 'text' as 'json'})
        .pipe(map(token => {
          return token;
        }))
        .pipe(first()).subscribe(
        tokens => {
          if (tokens.length > 20) {
            this.dataStore.setToken(tokens);
          } else {
            this.logout();
          }
        }
      );
    }
  }
}
