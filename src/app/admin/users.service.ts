import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Banks, EditUser, Lgas, Privilege, Roles, States, Tenants, User, UserFile} from './users.model';
import {Observable} from 'rxjs';
import {Endpoints} from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUsers = Endpoints.mainUrl + Endpoints.adminApi + '/users';
  private apiMail = this.apiUsers + '/mail';
  private apiRoles = this.apiUsers + '/roles';
  private apiTenants = Endpoints.mainUrl + Endpoints.apiUrl + '/tenants';
  private apiFile = Endpoints.mainUrl + Endpoints.adminApi + '/users/file';
  private apiTasks = Endpoints.mainUrl + Endpoints.adminApi + '/users/tasks';
  private apiStates = Endpoints.mainUrl + Endpoints.adminApi + '/users/states';
  private apiLga = Endpoints.mainUrl + Endpoints.adminApi + '/users/lgas';
  private apiBanks = Endpoints.mainUrl + Endpoints.adminApi + '/users/banks';

  constructor(private http: HttpClient) {
  }

  getUsers() {
    return this.http.get<User[]>(this.apiUsers)
      .pipe(map(configChk => {
        return configChk;
      }));
  }

  getUserByName(username: string, type: string) {
    return this.http.get<User>(this.apiUsers + '/s/' + username + '/' + type)
      .pipe(map(configChk => {
        return configChk;
      }));
  }

  editUser(data: EditUser) {
    return this.http.put<User>(this.apiUsers + '/' + data.id, data)
      .pipe(map(res => {
        return res;
      }));
  }

  updateUser(data: User) {
    return this.http.put<User>(this.apiUsers + '/edit/' + data.id, data)
      .pipe(map(res => {
        return res;
      }));
  }

  editUserRole(data: User) {
    return this.http.put<User>(this.apiUsers + '/edit/role/' + data.id, data)
      .pipe(map(res => {
        return res;
      }));
  }

  getRoles() {
    return this.http.get<Roles[]>(this.apiRoles)
      .pipe(map(configChk => {
        return configChk;
      }));
  }

  getDomains() {
    return this.http.get<string[]>(this.apiRoles + '/domains')
      .pipe(map(configChk => {
        return configChk;
      }));
  }

  getPrivileges() {
    return this.http.get<Privilege[]>(this.apiRoles + '/privileges')
      .pipe(map(configChk => {
        return configChk;
      }));
  }

  editRole(data: Roles) {
    return this.http.post<Roles>(this.apiRoles + '/save', data)
      .pipe(map(res => {
        return res;
      }));
  }

  deleteRole(data: Roles) {
    return this.http.delete<any>(this.apiRoles + '/remove/' + data.id)
      .pipe(map(res => {
        return res;
      }));
  }

  addNewUser(configData: User) {
    return this.http.post<User>(this.apiUsers + '/register', configData)
      .pipe(map(config => {
        return config;
      }));
  }

  verifyNewUser(configData: User) {
    return this.http.post<User>(this.apiUsers + '/register/verify', configData)
      .pipe(map(config => {
        return config;
      }));
  }

  userVerification(configData) {
    return this.http.post<User>(this.apiUsers + '/verification', configData)
      .pipe(map(config => {
        return config;
      }));
  }

  deleteUser(data: User) {
    return this.http.delete<any>(this.apiUsers + '/remove/' + data.id)
      .pipe(map(res => res));
  }

  getTenants() {
    return this.http.get<Tenants[]>(this.apiTenants).pipe(map(res => res));
  }

  saveTenants(data: Tenants) {
    return this.http.post<Tenants>(this.apiTenants, data).pipe(map(res => res));
  }

  editTenants(data: Tenants) {
    return this.http.put<Tenants>(this.apiTenants, data).pipe(map(res => res));
  }

  deleteTenant(data: Tenants) {
    return this.http.delete(this.apiTenants + '/remove/' + data.id).pipe(map(res => res));
  }

// Temp Staff Files API Calls
  getUserFile(id: number) {
    return this.http.get<UserFile[]>(this.apiFile + '/cid/' + id).pipe(map(res => res));
  }

  saveUserFile(data: FormData) {
    return this.http.post<UserFile[]>(this.apiFile, data)
      .pipe(map(res => res));
  }

  editUserFile(data: FormData, id: number) {
    return this.http.put<UserFile>(this.apiFile + '/edit/' + id, data)
      .pipe(map(res => res));
  }

  deleteUserFile(data: UserFile) {
    return this.http.delete<any>(this.apiFile + '/remove/' + data.id)
      .pipe(map(res => res));
  }

  getUserPdf(report: UserFile): Observable<any> {
    const headers = new HttpHeaders();
    // @ts-ignore
    return this.http.get(this.apiFile + '/pdf/' + report.id, {headers, responseType: 'arrayBuffer'});
  }

  getUserPassport(id: number) {
    return this.http.get<UserFile>(this.apiFile + '/subscription/' + id + '/passport').pipe(map(res => res));
  }

  defaultRole(data: Roles) {
    return this.http.post<Roles>(this.apiRoles + '/default', data)
      .pipe(map(res => {
        return res;
      }));
  }

  // States Api Calls
  getStates() {
    return this.http.get<States[]>(this.apiStates)
      .pipe(map(data => {
        return data;
      }));
  }

  // Lgas Api Calls
  getLgas() {
    return this.http.get<Lgas[]>(this.apiLga)
      .pipe(map(data => {
        return data;
      }));
  }

  // Lgas Api Calls
  getBanks() {
    return this.http.get<Banks[]>(this.apiBanks)
      .pipe(map(data => {
        return data;
      }));
  }

  getStateLgas(data: number) {
    return this.http.get<Lgas[]>(this.apiLga + '/state/' + data)
      .pipe(map(res => {
        return res;
      }));
  }
}
