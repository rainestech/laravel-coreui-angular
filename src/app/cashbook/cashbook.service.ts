import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Endpoints} from '../endpoints';
import {AccountChart, Budget, Category, Charts, Transactions} from '../banking/banking.model';
import {SettingEntity} from '../admin/users.model';

@Injectable({
  providedIn: 'root'
})
export class CashbookService {

  private api = Endpoints.mainUrl + Endpoints.appApi + '/cashbook';
  private apiCharts = this.api + '/charts';
  private apiFinalAccount = this.api + '/finalAccount';
  private apiSettings = this.api + '/settings';
  private apiAccType = this.api + '/account';
  private apiBudget = this.api + '/budget';
  private apiAccClass = this.api + '/category';

  constructor(private http: HttpClient) {
  }

  // AccountType api calls
  getAccType() {
    return this.http.get<AccountChart[]>(this.apiAccType).pipe(map(res => res));
  }

  getAccountChartReport(): Observable<any> {
    const headers = new HttpHeaders();
    // @ts-ignore
    return this.http.get(this.apiAccType + '/pdf', {headers, responseType: 'arrayBuffer'});
  }

  saveAccType(data: AccountChart) {
    return this.http.post<AccountChart>(this.apiAccType, data).pipe(map(res => res));
  }

  editAccType(data: AccountChart) {
    return this.http.put<AccountChart>(this.apiAccType, data).pipe(map(res => res));
  }

  deleteAccType(data: AccountChart) {
    return this.http.delete<any>(this.apiAccType + '/remove/' + data.id).pipe(map(res => res));
  }

  // AccountType api calls
  getCategory() {
    return this.http.get<Category[]>(this.apiAccClass).pipe(map(res => res));
  }

  saveCategory(data: Category) {
    return this.http.post<Category>(this.apiAccClass, data).pipe(map(res => res));
  }

  editCategory(data: Category) {
    return this.http.put<Category>(this.apiAccClass, data).pipe(map(res => res));
  }

  deleteCategory(data: Category) {
    return this.http.delete<any>(this.apiAccClass + '/remove/' + data.id).pipe(map(res => res));
  }

  // Charts api calls
  getCharts(year: number) {
    return this.http.get<Charts[]>(this.apiCharts + '/yr/' + year).pipe(map(res => res));
  }

  saveChart(data: Charts) {
    return this.http.post<Charts>(this.apiCharts, data).pipe(map(res => res));
  }

  editChart(data: Charts) {
    return this.http.put<Charts>(this.apiCharts, data).pipe(map(res => res));
  }

  deleteCharts(data: Charts) {
    return this.http.delete<any>(this.apiCharts + '/remove/' + data.id).pipe(map(res => res));
  }

  initNewYear(year: number) {
    return this.http.get<Charts[]>(this.apiSettings + '/initYr/' + year).pipe(map(res => res));
  }

  // Settings Api
  getSetting() {
    return this.http.get<SettingEntity>(this.apiSettings).pipe(map(res => res));
  }

  saveSetting(settings: SettingEntity) {
    return this.http.post<SettingEntity>(this.apiSettings, settings).pipe(map(res => res));
  }

  // Budget Api
  getCurrentYearBudget() {
    return this.http.get<Budget[]>(this.apiBudget + '/year').pipe(map(res => res));
  }

  getBudgetYear(yr: number) {
    return this.http.get<Budget[]>(this.apiBudget + '/year/' + yr).pipe(map(res => res));
  }

  saveBudget(data: Budget) {
    return this.http.post<Budget>(this.apiBudget, data).pipe(map(res => res));
  }

  editBudget(data: Budget) {
    return this.http.put<Budget>(this.apiBudget, data).pipe(map(res => res));
  }

  deleteBudget(id: number) {
    return this.http.delete<Budget>(this.apiBudget + '/rem/' + id).pipe(map(res => res));
  }
}
