import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Endpoints} from '../endpoints';
import {NavData} from '../_nav';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  private apiUrl = Endpoints.mainUrl + Endpoints.adminApi + '/v1/chats/';

  constructor(private http: HttpClient) {
  }

  getFriends() {
    return this.http.get<any[]>(this.apiUrl + 'friends').pipe(map(res => res));
  }

  getContacts() {
    return this.http.get<any[]>(this.apiUrl + 'contacts').pipe(map(res => res));
  }

  saveFriends(data: any) {
    return this.http.post<any[]>(this.apiUrl + 'friends', data).pipe(map(res => res));
  }
}
