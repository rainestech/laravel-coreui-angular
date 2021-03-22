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
  private apiRequest = Endpoints.mainUrl + Endpoints.apiUrl + '/request';
  private apiPages = Endpoints.mainUrl + Endpoints.apiUrl + '/snippets';

  constructor(private http: HttpClient) {
  }

  search(data: any) {
    return this.http.post<any>(this.apiSearch, data).pipe(map(res => res));
  }

  getShortLists() {
    return this.http.get<any>(this.apiSearch + '/shortlist').pipe(map(res => res));
  }

  getRecruiterShortLists(id: any) {
    return this.http.get<any>(this.apiSearch + '/shortlist/' + id).pipe(map(res => res));
  }

  getSearchAnalytics(id: any) {
    return this.http.get<any>(this.apiSearch + '/terms/' + id).pipe(map(res => res));
  }

  saveShortLists(data: any) {
    return this.http.post<any>(this.apiSearch + '/shortlist', data).pipe(map(res => res));
  }

  getRequest() {
    return this.http.get<any[]>(this.apiRequest).pipe(map(res => res));
  }

  getRequestList() {
    return this.http.get<any[]>(this.apiRequest + '/list').pipe(map(res => res));
  }

  getRecruiterRequest(data: number) {
    return this.http.get<any[]>(this.apiRequest + '/rid/' + data).pipe(map(res => res));
  }

  getRecruiterRequestList(data: number) {
    return this.http.get<any[]>(this.apiRequest + '/list/rid/' + data).pipe(map(res => res));
  }

  getCandidatesRequestList(data: number) {
    return this.http.get<any[]>(this.apiRequest + '/list/cid/' + data).pipe(map(res => res));
  }

  saveRequest(data: any) {
    return this.http.post<any>(this.apiRequest, data).pipe(map(res => res));
  }

  toggleRequestApproval(data: number) {
    return this.http.get<any>(this.apiRequest + '/toggle/' + data).pipe(map(res => res));
  }

  saveAllRequest(data: any) {
    return this.http.post<any>(this.apiRequest + '/all', data).pipe(map(res => res));
  }

  getToken() {
    return this.http.get<any>(this.apiSearch + '/token').pipe(map(res => res));
  }

  getTokenPage() {
    return this.http.get<any>(this.apiPages + '/name/token').pipe(map(res => res));
  }

  saveSnippet(data: any) {
    return this.http.post<any>(this.apiPages, data).pipe(map(res => res));
  }

  getPages() {
    return this.http.get<any[]>(this.apiPages).pipe(map(res => res));
  }

  deletePages(id: number) {
    return this.http.delete(this.apiPages + '/remove/' + id).pipe(map(res => res));
  }
}
