import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Endpoints} from "../../endpoints";
import {User} from "../../admin/users.model";
import {FileStorage} from "../../storage/storage.model";
import {ProfileService} from "../profile.service";
import {DataService} from "../../service/data.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-profile-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  view = 2;
  fileLink: string = Endpoints.mainUrl + Endpoints.fsDL + '/';
  @Input() profile: any;
  @Input() user: any;
  @Input() enableEdit: boolean = false;
  loginUser: User;
  dataLoaded = false;
  passport: FileStorage;
  @Input() enableClose: boolean = false;
  @Output() closed = new EventEmitter<boolean>();

  constructor(private http: ProfileService, private dataStore: DataService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    if(!this.user) {
      this.loginUser = this.dataStore.getUser();
    } else {
      this.loginUser = this.user;
    }

    this.passport = this.loginUser.passport;

    if (!this.profile) {
      this.http.getMyProfile().pipe(first()).subscribe(res => {
        this.profile = res;
        if (res.logo) {
          this.passport = res.logo;
        }
        this.dataLoaded = true;
      }, () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Complete first your profile'
        });
        this.router.navigate(['/profile-options']);
      });
    } else {
      if (this.profile.logo) {
        this.passport = this.profile.logo;
      }
      this.dataLoaded = true;
    }
  }

  editProfile() {
    this.view = 2;
  }

  close() {
    this.closed.emit(true);
  }
}
