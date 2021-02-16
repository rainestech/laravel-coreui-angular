import {Component, OnInit} from '@angular/core';
import {NavData, navItems} from '../../_nav';
import {LayoutService} from '../layout.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Endpoints} from '../../endpoints';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {getYearMonths, setMonthRange, SettingEntity, setYearOpts, User} from '../../../../../../src/app/admin/users.model';
import {AutoLogoutService} from "../../service/autologout.service";
import {CashbookService} from "../../../../../../src/app/cashbook/cashbook.service";
import {AuthService} from "../../service/auth.service";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;
  student: any = 'lg';
  year = new Date().getFullYear();
  public element: HTMLElement;
  dataLoaded = false;
  cYear = new Date().getFullYear();
  userNav: NavData;
  roleNav: NavData;
  accessNav: NavData;
  tenantNav: NavData;
  loginUser: User;
  imageSrc: any[] = [];
  fsPath = '';
  enableSettings = false;
  settingsForm: FormGroup;
  years = setYearOpts();
  monthOpts = getYearMonths();
  settings: SettingEntity;
  private settingsFormValue: any;

  constructor(private http: LayoutService,
              private router: Router,
              private formBuilder: FormBuilder,
              private autoLogout: AutoLogoutService,
              private authService: AuthService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private dataStore: DataService) {
    this.autoLogout.setLastAction(Date.now());
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnInit(): void {
    this.imageSrc['passport'] = 'assets/img/avatars/1.jpg';
    this.loginUser = this.dataStore.getUser();

    // if (this.loginUser?.passport) {
    //   this.fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/' + this.loginUser.passport.link;
    // }

    this.dataStore.currentUser.subscribe(res => {
      if (res?.passport) {
        this.fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/' + res.passport.link;
      }
    });

    this.http.getNavItems('supreme').pipe(first()).subscribe(
      data => {
        const adminNav = data.filter(d => d.module === 'Admin');
        const settingsNav = data.filter(d => d.module === 'Settings');
        const searchNav = data.filter(d => d.module === 'Search');

        if (searchNav.length > 1) {
          this.navItems = [...this.navItems,
            {title: true,  name: 'Search'},
            ...searchNav]
        }
        if (settingsNav.length > 1) {
          this.navItems = [...this.navItems,
            {title: true,  name: 'Settings'},
            ...settingsNav]
        }
        if (adminNav.length > 1) {
          this.navItems = [...this.navItems,
            {title: true,  name: 'Admin'},
            ...adminNav]
        }

        this.dataLoaded = true;
      });
    this.dataLoaded = true;
  }

  logout() {
    this.authService.logout(true);
  }

  private initSettingForm(res: SettingEntity) {
    this.settingsForm = this.formBuilder.group({
      curYear: [res.curYear],
      yearClosed: [new Date(res.yearClosed)],
      curMonth: [res.curMonth + ', ' + res.curYear],
    });

    this.settingsFormValue = this.settingsForm.value;
    this.monthOpts = setMonthRange(this.settings);
    this.enableSettings = true;
  }

}
