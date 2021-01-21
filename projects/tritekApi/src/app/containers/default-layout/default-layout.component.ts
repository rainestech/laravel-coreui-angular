import {Component, OnInit} from '@angular/core';
import {NavData, navItems} from '../../_nav';
import {LayoutService} from '../layout.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Endpoints} from '../../endpoints';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {getYearMonths, setMonthRange, SettingEntity, setYearOpts, User} from '../../../../../../src/app/admin/users.model';
import {AuthService, AutoLogoutService} from '../../../../../../src/app/services';
import {CashbookService} from '../../../../../../src/app/cashbook/cashbook.service';
import {DataService} from '../../../../../../src/app/services/data.service';

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
              private cashbookService: CashbookService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private dataStore: DataService) {
    this.autoLogout.setLastAction(Date.now());
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnInit(): void {
    this.imageSrc['passport'] = 'assets/img/avatars/0.jpeg';
    this.loginUser = this.dataStore.getUser();

    if (this.loginUser.passport) {
      this.fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/' + this.loginUser.passport.link;
    }

    this.dataStore.currentUser.subscribe(res => {
      if (res?.passport) {
        this.fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/' + res.passport.link;
      }
    });

    this.getSettings();

    this.http.getNavItems().pipe(first()).subscribe(
      data => {
        const admin = data.find(d => d.module === 'Admin');
        this.userNav = admin ? admin.children.find(d => d.name === 'Manage Users') : null;
        this.roleNav = admin ? admin.children.find(d => d.name === 'Manage Roles') : null;
        this.accessNav = admin ? admin.children.find(d => d.name === 'Access Control') : null;
        // if (this.loginUser.tenants.isSuper) {
        //   this.tenantNav = admin ? admin.children.find(d => d.name === 'Tenants') : null;
        // }
        let modules = data.filter(d => d.module !== 'Admin');
        modules = modules.filter(d => d.module.indexOf('Settings') === -1);
        const settings = data.filter(d => d.module.indexOf('Settings') !== -1);
        this.navItems = [...this.navItems, ...modules, ...settings];
        this.dataLoaded = true;
      });
    this.dataLoaded = true;
  }

  logout() {
    this.authService.logout(true);
  }

  initYear() {
    this.confirmationService.confirm({
      message: 'Confirm Initialization of New Year?',
      header: 'Process Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cashbookService.initNewYear(this.settings.curYear).pipe(first()).subscribe(() => {
          this.messageService.add({
            severity: 'success', summary: 'Initialization Successful!',
            detail: this.settings.curYear + ' year initialized successfully.'
          });
        });
      },
      reject: () => {
        return;
      }
    });
  }

  private getSettings() {
    this.cashbookService.getSetting().pipe(first()).subscribe(res => {
      this.dataStore.setSettings(res);
      this.settings = res;
      this.initSettingForm(res);
    });
  }

  private initSettingForm(res: SettingEntity) {
    this.settingsForm = this.formBuilder.group({
      curYear: [res.curYear],
      yearClosed: [new Date(res.yearClosed)],
      curMonth: [res.curMonth + ', ' + res.curYear],
    });

    this.settingsFormValue = this.settingsForm.value;
    this.settingsValueChanges();
    this.monthOpts = setMonthRange(this.settings);
    this.enableSettings = true;
  }

  private settingsValueChanges() {
    this.settingsForm.controls['curYear'].valueChanges.subscribe(value => {
      this.settings.curYear = +value;
      this.confirm('Confirm change of current year?');
    });

    this.settingsForm.controls['yearClosed'].valueChanges.subscribe(value => {
      this.settings.yearClosed = value;
      this.confirm('Confirm change of Year End Date?');
    });

    this.settingsForm.controls['curMonth'].valueChanges.subscribe(value => {
      const val = value.split(', ');
      this.settings.curMonth = val[0];
      this.confirm('Confirm change of current Month?');
    });
  }

  confirm(data: string) {
    this.confirmationService.confirm({
      message: data,
      header: 'Process Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateSettings();
      },
      reject: () => {
        // this.settingsForm.controls['curMonth'].updateValueAndValidity({onlySelf: true, emitEvent: false});
        // this.settingsForm.markAsPristine();
        this.settingsForm.reset(this.settingsFormValue);
        return;
      }
    });
  }

  private updateSettings() {
    this.cashbookService.saveSetting(this.settings).pipe(first()).subscribe(res => {
      this.initSettingForm(res);
      this.settings = res;
    });
  }

  closeMonth() {
    this.confirmationService.confirm({
      message: 'Confirm Close of ' + this.settingsForm.controls['curMonth'].value + ' ?',
      header: 'Process Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cashbookService.saveSetting(this.settings).pipe(first()).subscribe(res => {
          this.initSettingForm(res);
          this.settings = res;
          this.messageService.add({
            severity: 'success', summary: 'Month Successfully Closed!',
            detail: ''
          });
        });
      },
      reject: () => {
        return;
      }
    });
  }
}
