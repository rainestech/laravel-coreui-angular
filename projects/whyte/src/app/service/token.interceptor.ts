import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})

export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private dataStore: DataService,
    private authenticationService: AuthService,
    private messageService: MessageService
  ) {
  }

  setToken(token) {
    this.dataStore.setToken(token);
    // sessionStorage.setItem('access_token', token);
  }

  removeBearer(tokenString, set = false) {
    const [Bearer, token] = tokenString.split(' ');

    if (set === true && token) {
      return this.setToken(token);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // const token = sessionStorage.getItem('access_token');
    const token = this.dataStore.getToken();
    // console.log('Token: ' + token);
    if (token) {
      if (this.authenticationService.tokenExpired()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Token Expired', detail: 'User Token has expired, login to get a new one.'
        });
        this.logout();
        return;
      }

      if (request.url === 'https://api.ocr.space/parse/image') {
        request = request.clone({
          setHeaders: {
            apiKey: `37c27312e888957`
          }
        });
      } else {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request)

      .pipe(tap(event => {
          // this.event = event;
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
            const authorization = event.headers.get('Authorization');
            // console.log('\n authorization header: ' + JSON.stringify(event.headers.));
            if (authorization) {
              this.removeBearer(authorization, true);
            }
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            // console.error('\n' + err.message);
            if ((err.status === 401 || err.status === 403)) {
              this.logout();
            } else if (err.status === 404 || err.status === 405) {
              this.messageService.add({
                severity: 'info',
                summary: 'Resource Not Found',
                detail: err.error.message ? err.error.message : 'The Requested Resource was NOT FOUND on the Server'
              });
            } else if (err.error instanceof Blob) {
              const reader: FileReader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                  const err1 = JSON.parse(reader.result);
                  this.messageService.add({
                    severity: 'error',
                    summary: err1.error, detail: err1.message
                  });
                }
              };
              reader.readAsText(err.error);
            } else if (err.error.error) {
              this.messageService.add({
                severity: 'error',
                summary: err.error.error, detail: err.error.message
              });
            }
          }
        }),

        catchError((err: any) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            // console.error('An error occurred:', err.error.message);
          } else if (err.status === 401) {
            this.router.navigate(['/login']);
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            // console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
          }

          // ...optionally return a default fallback value so app can continue (pick one)
          // which could be a default value
          // return Observable.of({my: "default value..."});
          // or simply an empty observable
          // return Observable.empty();
          return throwError(err);
        }));
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
