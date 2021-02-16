import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SettingEntity, User} from '../admin/users.model';

@Injectable()
export class DataService {
  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  public currentUser: Observable<User> = this.currentUserSubject.asObservable();

  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public token: Observable<string> = this.tokenSubject.asObservable();

  private actionSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public action: Observable<number> = this.actionSubject.asObservable();

  // private personnelSubject: BehaviorSubject<Personnel> = new BehaviorSubject<Personnel>(new Personnel());
  // public personnel: Observable<Personnel> = this.personnelSubject.asObservable();

  private filterSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public resetFilter: Observable<boolean> = this.filterSearch.asObservable();

  private settingsSubject: BehaviorSubject<SettingEntity> = new BehaviorSubject<SettingEntity>(null);
  public settings: Observable<SettingEntity> = this.settingsSubject.asObservable();

  constructor() {
  }

  setUser(user: User) {
    this.currentUserSubject.next(user);
    sessionStorage.setItem('u', JSON.stringify(user));
  }

  setFilterSearch(v: boolean) {
    this.filterSearch.next(v);
  }

  setToken(token: string) {
    this.tokenSubject.next(token);
    sessionStorage.setItem('t', token);
  }

  getToken(): string {
    if (this.tokenSubject.getValue()) {
      return this.tokenSubject.getValue();
    } else {
      const t = sessionStorage.getItem('t');
      this.tokenSubject.next(t);
      return t;
    }
  }

  setSettings(res: SettingEntity) {
    this.settingsSubject.next(res);
    sessionStorage.setItem('s', JSON.stringify(res));
  }

  getSettings(): SettingEntity {
    if (this.settingsSubject.getValue()) {
      return this.settingsSubject.getValue();
    } else {
      const s = JSON.parse(sessionStorage.getItem('s'));
      this.tokenSubject.next(s);
      return s;
    }
  }

  // setPersonnel(p: Personnel) {
  //   this.personnelSubject.next(p);
  //   sessionStorage.setItem('p', JSON.stringify(p));
  // }
  //
  // getPersonnel(): Personnel {
  //   if (this.personnelSubject.getValue().id) {
  //     return this.personnelSubject.getValue();
  //   } else {
  //     const p = JSON.parse(sessionStorage.getItem('p'));
  //     this.personnelSubject.next(p);
  //     return p;
  //   }
  // }

  setAction(actionTime: number) {
    this.actionSubject.next(actionTime);
    sessionStorage.setItem('l', actionTime.toString());
  }

  getAction(): number {
    if (this.actionSubject.getValue()) {
      return this.actionSubject.getValue();
    } else {
      const l = parseInt(sessionStorage.getItem('l'), 10);
      this.actionSubject.next(l);
      return l;
    }
  }

  getUser(): any {
    if (this.currentUserSubject.getValue().id) {
      return this.currentUserSubject.getValue();
    } else {
      const u = JSON.parse(sessionStorage.getItem('u'));
      this.currentUserSubject.next(u);
      return u;
    }
  }

  logout() {
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.actionSubject.next(null);
    // this.personnelSubject.next(null);
    sessionStorage.removeItem('t');
    sessionStorage.removeItem('l');
    sessionStorage.removeItem('u');
    sessionStorage.clear();
  }
}
