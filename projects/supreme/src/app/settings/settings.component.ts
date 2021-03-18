import { Component, OnInit } from '@angular/core';
import {DataService} from "../service/data.service";
import {User} from "../admin/users.model";
import {ProfileService} from "../profile/profile.service";
import {first} from "rxjs/operators";
import {FileStorage} from "../admin/file.reader";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    view = 1;
    loginUser: User;
    profile: any;
  constructor(private dataService: DataService, private http: ProfileService, private router: Router) { }

  ngOnInit(): void {
      this.loginUser = this.dataService.getUser();

      this.http.getMyProfile().pipe(first()).subscribe(res => this.profile = res);
      if (this.loginUser.companyName) {
          console.log(this.loginUser.companyName);
        this.view = 1;
      } else {
        this.view = 2;
      }
  }

    getPassport() {
        if (this.loginUser.passport) {
            return [this.loginUser.passport];
        } else {
            const passport = new FileStorage();
            passport.tag = 'passport';
            passport.objID = 0;
            return [passport];
        }
    }

    getLogo() {
        if (this.profile?.logo) {
            return [this.profile.logo];
        } else {
            const passport = new FileStorage();
            passport.tag = 'logo';
            passport.objID = 0;
            return [passport];
        }
    }

    close() {
        this.router.navigate(['/profile']);
    }
}
