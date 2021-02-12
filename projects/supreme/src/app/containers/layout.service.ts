import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Endpoints} from '../endpoints';
import {NavData} from '../_nav';

@Injectable({
  providedIn: 'root'
})

export class LayoutService {

  private apiUrl = Endpoints.mainUrl + Endpoints.adminApi + '/v1/navItems/cms';

  // private apiSettings = Endpoints.mainUrl + Endpoints.appApi + '/module/setting';

  constructor(private http: HttpClient) {
  }

  getNavItems() {
    return this.http.get<NavData[]>(this.apiUrl)
      .pipe(map(configChk => configChk));
  }

  // getSetting() {
  //   return this.http.get<SettingEntity>(this.apiSettings).pipe(map(res => res));
  // }
  //
  // saveSetting(settings: SettingEntity) {
  //   return this.http.put<SettingEntity>(this.apiSettings, settings).pipe(map(res => res));
  // }

  // closeMonth(settings: SettingEntity) {
  //   return this.http.post<SettingEntity>(this.apiSettings, settings).pipe(map(res => res));
  // }
}
