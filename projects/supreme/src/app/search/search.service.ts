import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Endpoints} from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiSearch = Endpoints.mainUrl + Endpoints.apiUrl + '/search';

  constructor(private http: HttpClient) {
  }

  search(data: any) {
    return this.http.post<any>(this.apiSearch, data).pipe(map(res => res));
  }

  getShortLists() {
    return this.http.get<any>(this.apiSearch + '/shortlist').pipe(map(res => res));
  }

  saveShortLists(data: any) {
    return this.http.post<any>(this.apiSearch + '/shortlist', data).pipe(map(res => res));
  }
}
