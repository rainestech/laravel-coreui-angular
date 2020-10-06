import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Endpoints} from '../endpoints';
import {Banks} from '../admin/users.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private api = Endpoints.mainUrl + Endpoints.appApi + '/settings';
  private apiBanks = this.api + '/banks';
  private apiCorr = this.api + '/correspondence';

  constructor(private http: HttpClient) {
  }

  // Banks subscription Api Calls
  getBank() {
    return this.http.get<Banks[]>(this.apiBanks)
      .pipe(map(data => data));
  }

  saveBank(data: Banks) {
    return this.http.post<Banks>(this.apiBanks, data)
      .pipe(map(res => res));
  }

  editBank(data: Banks) {
    return this.http.put<Banks>(this.apiBanks, data)
      .pipe(map(res => res));
  }

  deleteBank(data: Banks) {
    return this.http.delete<any>(this.apiBanks + '/' + data.id)
      .pipe(map(res => res));
  }

  // Corr subscription Api Calls
  // getCorrespondence() {
  //   return this.http.get<CorrespondenceType[]>(this.apiCorr)
  //     .pipe(map(data => data));
  // }
  //
  // saveCorrespondence(data: CorrespondenceType) {
  //   return this.http.post<CorrespondenceType>(this.apiCorr, data)
  //     .pipe(map(res => res));
  // }
  //
  // editCorrespondence(data: CorrespondenceType) {
  //   return this.http.put<CorrespondenceType>(this.apiCorr, data)
  //     .pipe(map(res => res));
  // }
  //
  // deleteCorrespondence(data: CorrespondenceType) {
  //   return this.http.delete<any>(this.apiCorr + '/remove/' + data.id)
  //     .pipe(map(res => res));
  // }
}
