import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Endpoints} from "../../endpoints";
import {Cols, User} from "../../admin/users.model";
import {ProfileService} from "../../profile/profile.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {UsersService} from "../../admin/users.service";
import {first} from "rxjs/operators";
import {FileStorage} from "../../storage/storage.model";

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {
    view = 1;
  dataLoaded = true;
  gridList = true;
  searchTerm = new FormControl('');
  @ViewChild('dt') table: any;
  candiates: any[] = [];
  allCandidates: any[] = [];
  p = 1;
  fileLink = Endpoints.mainUrl + Endpoints.fsDL + '/';
  cols: Cols[] = [];
  selProfile: any;
  noUserProfiles: any[] = [];

  constructor(private http: ProfileService,
              private messageService: MessageService,
              private confirmService: ConfirmationService,
              private userService: UsersService) { }

  ngOnInit(): void {
    this.cols = [
      {header: 'Title', field: 'title'},
      {header: 'Name', field: 'name'},
      {header: 'Email', field: 'user.email'},
      {header: 'Record Date', field: 'created_at'},
    ];

    this.refresh();
    this.searchTerm.valueChanges.subscribe(res => {
      if (res.length > 0) {
        this.candiates = this.allCandidates.filter(c => (c.name?.toLowerCase().includes(res.toLowerCase()) ||
            c.title?.toLowerCase().includes(res.toLowerCase()) || c.email?.toLowerCase().includes(res.toLowerCase())));
      } else {
        this.candiates = this.allCandidates;
      }
    });
  }

  addCandidate() {
    
  }

  toggleView() {
    this.gridList = !this.gridList;
  }

  refresh() {
    this.http.getCandidates().pipe(first()).subscribe(res => {
      this.candiates = res;
      this.allCandidates = res;
      this.dataLoaded = true;
      this.initNoUser();
    });
  }

  viewDetails(cand: any) {
    this.selProfile = cand;
    this.view = 2;
  }

  editProfile(cand: any) {
    this.selProfile = cand;
    this.view = 3;
  }

  deleteProfile(cand: any) {
    this.selProfile = cand;
    this.confirmService.confirm({
      message: 'Are you sure you want to delete profile for ' + cand.name + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteCandidates(cand.id).pipe(first()).subscribe(
            () => {
              this.candiates = this.candiates.filter(f => f !== cand);
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: cand.name.toUpperCase() + ' Profile Removed!'
              });
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  close() {
    this.view = 1;
  }

  private initNoUser() {
    this.noUserProfiles = this.candiates.filter(c => !c.user);
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
}
