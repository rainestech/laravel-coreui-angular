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
  private apiContact = Endpoints.mainUrl + Endpoints.adminApi + '/contact';
  private apiRoles = this.apiUsers + '/roles';
  private apiFile = Endpoints.mainUrl + Endpoints.adminApi + '/users/file';

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

  editUser(data: any) {
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

  forgotPassword(configData: any) {
    return this.http.post<any>(this.apiUsers + '/recover', configData)
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

  resetPassword(data: any) {
    return this.http.post<any>(this.apiUsers + '/password/reset', data)
      .pipe(map(config => {
        return config;
      }));
  }

  contact(data: any) {
    return this.http.post<any>(this.apiContact, data).pipe(map(res => res));
  }

  regenerateToken(param: { username: string, id: number}) {
    return this.http.post<User>(this.apiUsers + '/regenerate-token/' + param.id, param)
        .pipe(map(config => {
          return config;
        }));
  }

  deleteUser(data: User) {
    return this.http.delete<any>(this.apiUsers + '/remove/' + data.id)
      .pipe(map(res => res));
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

  changePwd(data: any) {
    return this.http.post<User>(this.apiUsers + '/changePwd', data)
        .pipe(map(res => {
          return res;
        }));
  }
}
