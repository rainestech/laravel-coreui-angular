import {Component, OnInit} from '@angular/core';
import {navItems} from '../../_nav';
import {LayoutService} from '../layout.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Endpoints} from '../../endpoints';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AutoLogoutService} from "../../service/autologout.service";
import {AuthService} from "../../service/auth.service";
import {DataService} from "../../service/data.service";
import {User} from "../../admin/users.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;
  year = new Date().getFullYear();
  public element: HTMLElement;
  dataLoaded = false;
  loginUser: User;
  imageSrc: any[] = [];
  fsPath = '';
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

  ngOnInit(): void {
    this.imageSrc['passport'] = 'assets/img/avatars/1.jpg';
    this.loginUser = this.dataStore.getUser();

    // if (this.loginUser?.passport) {
    //   this.fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/' + this.loginUser.passport.link;
    // }

    this.dataStore.currentUser.subscribe(res => {
      if (res?.passport) {
        // console.log('setting picture');
        this.fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/' + res.passport.link;
      }
    });

    this.http.getNavItems('supreme').pipe(first()).subscribe(
      data => {
        const adminNav = data.filter(d => d.module === 'Admin');
        const settingsNav = data.filter(d => d.module === 'Settings');
        const searchNav = data.filter(d => d.module === 'Search');
        const profileNav = data.filter(d => d.module === 'Profile');

        if (profileNav.length > 0) {
          this.navItems = [
              {title: true,  name: 'Profile'},
            ...profileNav]
        }
        if (searchNav.length > 0) {
          this.navItems = [...this.navItems,
            {title: true,  name: 'Search'},
            ...searchNav]
        }
        if (settingsNav.length > 0) {
          this.navItems = [...this.navItems,
            {title: true,  name: 'Settings'},
            ...settingsNav]
        }
        if (adminNav.length > 0) {
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

    getLogoRouteLink() {
        if (this.loginUser.role === 'RECRUITER') {
          return ['/search']
        } else {
          return ['/profile']
        }
    }

  deleteProfile() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Profile? This will also remove the associated account on the platform.',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteProfile().pipe(first()).subscribe(
            () => {
              this.messageService.add({severity: 'success', summary: 'Delete Success', detail: ' Profile removed from platform'});
              this.authService.logout(true);
            });
      },
      reject: () => {
        return;
      }
    });
  }
}
