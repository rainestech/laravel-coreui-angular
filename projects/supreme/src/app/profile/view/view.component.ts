import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Endpoints} from "../../endpoints";
import {User} from "../../admin/users.model";
import {FileStorage} from "../../storage/storage.model";
import {ProfileService} from "../profile.service";
import {DataService} from "../../service/data.service";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {first} from "rxjs/operators";
import {AuthService} from "../../service/auth.service";
import {DocService} from "../../docs/docs.service";
import {Documents} from "../../docs/docs.model";

@Component({
  selector: 'app-profile-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  view = 1;
  fileLink: string = Endpoints.mainUrl + Endpoints.fsDL + '/';
  @Input() profile: any;
  @Input() user: any;
  @Input() enableEdit: boolean = false;
  @Input() candidate: boolean;
  @Input() enableShortlist: boolean = false;
  loginUser: User;
  dataLoaded = false;
  passport: FileStorage;
  @Input() enableClose: boolean = false;
  @Input() enableVerify: boolean = false;
  @Output() closed = new EventEmitter<boolean>();
  @Output() shortlisted = new EventEmitter<any>();
  private token: string;
  docs: any[] = [];
  realUser: User;

  constructor(private http: ProfileService,
              private documentService: DocService,
              private dataStore: DataService, private router: Router, private messageService: MessageService,
              private confirmService: ConfirmationService, private authService: AuthService) { }

  ngOnInit(): void {
    this.token = this.dataStore.getToken();
    this.realUser = this.dataStore.getUser();
    if(!this.user) {
      this.loginUser = this.dataStore.getUser();
    } else {
      this.loginUser = this.user;
    }

    if (this.loginUser.id) {
      this.documentService.getUserDocs(this.loginUser.id).pipe(first()).subscribe(res => this.docs = res);
    }

    if (this.candidate === undefined && this.loginUser.role?.toLowerCase() === 'candidate') {
      this.candidate = true;
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
    if (this.candidate)
      this.view = 2;
    else this.view = 3;
    return false;
  }

  close() {
    this.closed.emit(true);
  }

  deleteProfile() {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete Profile? This will also remove the associated account on the platform.',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.http.deleteRecruiters(this.profile.id).pipe(first()).subscribe(
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

  getPassport(selProfile: any) {
    const fs = selProfile.user ? selProfile.user.passport?.id ? selProfile.user.passport : new FileStorage()
        : new FileStorage();
    fs.tag = 'passport';
    fs.objID = selProfile.user ? selProfile.user.id : 0;
    return [fs];
  }

  getUser(selProfile: any) {
    if (selProfile.user) {
      return selProfile.user;
    }

    return new User();
  }

  getLogo(selProfile: any) {
    if (!selProfile?.logo) {
      let fs: FileStorage = new FileStorage();
      fs.tag = 'logo';
      fs.objID = selProfile ? selProfile.id : 0;
      return [fs];
    } else {
      return [selProfile.logo];
    }
  }

  outEdit(event: any) {
    this.profile  = event;
  }

  back() {
    this.view = 1;
  }

  shortlist() {
    this.shortlisted.emit(this.profile);
  }

  download(doc: Documents) {
    // const data = Endpoints.mainUrl + '/api/v1/docs/dl/' + doc.file.link + '?token=' + this.token;
    return window.open(Endpoints.mainUrl + '/api/v1/docs/dl/' + doc.file.link + '?token=' + encodeURIComponent(this.token),
        '_blank');
  }

  verifyAccount() {
    this.confirmService.confirm({
      message: 'Are you sure you want to verify recruiter?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.verifyRecruiter(this.profile.id).pipe(first()).subscribe(
            () => {
              this.messageService.add(
                  {severity: 'success', summary: 'Verification Success', detail: ' Recruiter verified successfully'});
            });
      },
      reject: () => {
        return;
      }
    });
  }
}
