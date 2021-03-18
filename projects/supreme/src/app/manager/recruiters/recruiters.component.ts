import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Endpoints} from "../../endpoints";
import {Cols, User} from "../../admin/users.model";
import {ProfileService} from "../../profile/profile.service";
import {first} from "rxjs/operators";
import {ConfirmationService, MessageService} from "primeng/api";
import {UsersService} from "../../admin/users.service";
import {FileStorage} from "../../storage/storage.model";

@Component({
  selector: 'app-recruiters',
  templateUrl: './recruiters.component.html',
  styleUrls: ['./recruiters.component.scss']
})
export class RecruitersComponent implements OnInit {
  searchTerm: FormControl = new FormControl('');
  gridList = true;
  recruiters: any[] = [];
  fileLink: string = Endpoints.mainUrl + Endpoints.fsDL + '/';
  p = 1;
  cols: Cols[] = [];
  dataLoaded = false;
  view = 1;
  selProfile: any;
  users: User[] = [];
  noProfileUsers = [];
  @ViewChild('dt') table: any;

  constructor(private http: ProfileService,
              private messageService: MessageService,
              private confirmService: ConfirmationService,
              private userService: UsersService) { }

  ngOnInit(): void {
    this.cols = [
      {header: 'Name', field: 'user.name'},
      {header: 'Company Name', field: 'companyName'},
      {header: 'Email', field: 'user.email'},
      {header: 'Reg. Date', field: 'user.createdAt'},
      {header: 'Role', field: 'user.roles.*.role'},
    ];

    this.refresh();
  }

  refresh() {
    this.http.getRecruiters().pipe(first()).subscribe(res => {
      this.recruiters = res;
      this.dataLoaded = true;
      this.initNoProfile();
    });
  }

  initNoProfile() {
    this.userService.getUsers().pipe(first()).subscribe(res => {
      this.users = res;
      res.forEach(u => {
        if (!this.recruiters.find(r => u.id === r.user.id) && u.companyName) {
          this.noProfileUsers.push(u)
        }
      })
    });
  }

  toggleView() {
    this.gridList = !this.gridList;
  }

  addRecruiter() {
    this.view = 4;
  }

  viewDetails(rec: any) {
    this.selProfile = rec;
    this.view = 2;
  }

  editProfile(rec: any) {
    this.selProfile = rec;
    this.view = 3;
  }

  deleteProfile(rec: any) {
    this.selProfile = rec;
    this.confirmService.confirm({
      message: 'Are you sure you want to delete profile for ' + rec.companyName + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteRecruiters(rec.id).pipe(first()).subscribe(
            () => {
              this.recruiters = this.recruiters.filter(f => f !== rec);
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: rec.companyName.toUpperCase() + ' Profile Removed!'
              });
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  addUserProfile(rec: User) {
    this.selProfile = {};
    this.selProfile.user = rec;
    this.view = 3;
  }

  close() {
    this.view = 1;
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

  viewDash(data: any) {
      this.selProfile = data;
      this.view = 5;
  }
}
