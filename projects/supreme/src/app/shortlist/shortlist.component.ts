import { Component, OnInit } from '@angular/core';
import {SearchService} from "../search/search.service";
import {DataService} from "../service/data.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ProfileService} from "../profile/profile.service";
import {first} from "rxjs/operators";
import {FileStorage} from "../admin/file.reader";
import {User} from "../admin/users.model";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-shortlist',
  templateUrl: './shortlist.component.html',
  styleUrls: ['./shortlist.component.scss']
})
export class ShortlistComponent implements OnInit {
  loginUser;
  selProfile;
  view = 1;
  dataSet: any[] = [];
  allData: any[] = [];
  dataLoaded = false;
  search = new FormControl('', Validators.required);
  selCandidates: any[] = [];
  loginProfile: any;
  requested: number[] = [];
  approved: number[] = [];



  constructor(private http: SearchService,
              private dataService: DataService,
              private messageService: MessageService,
              private confirmService: ConfirmationService,
              private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    this.profileService.getMyProfile().pipe(first()).subscribe(res => {
      this.loginProfile = res;

      if (this.loginUser.companyName) {
        this.http.getRecruiterRequestList(res.id).pipe(first())
            .subscribe(res => {
              this.requested = res.filter(f => f.requested).map(r => r.cid);
              this.approved = res.filter(f => f.approved).map(r => r.cid);
            });
      } else {
        this.http.getCandidatesRequestList(res.id).pipe(first())
            .subscribe(res => this.requested = res.filter(f => f.requested).map(r => r.cid));
      }
    });

    this.refresh();

    this.search.valueChanges.subscribe(value => {
      if (!this.dataLoaded) { return; }
      else if (value.length < 1) {
        this.dataSet = this.allData;
      } else {
        this.dataSet = this.allData.filter(d => d.name?.toLowerCase().includes(value.toLowerCase()) || d.companyName?.toLowerCase().includes(value.toLowerCase())
            || ShortlistComponent.flatSkills(d).includes(value.toLowerCase()));
      }
    });
  }

  refresh() {
    this.http.getShortLists().pipe(first()).subscribe(res => {
      this.dataSet = res;
      this.allData = res;
      this.dataLoaded = true;
    });
  }

  getPassport(g: any) {
    if (g.user?.passport) {
      return [g.user.passport];
    }

    return [new FileStorage()]
  }

  viewDetails(g: any) {
    this.selProfile = g;
    this.view = 2;
  }

  close() {
    this.view = 1;
  }

  getUser(selProfile: any) {
    if (selProfile.user) {
      return selProfile.user;
    }

    return new User();
  }

  private static flatSkills(d: any) {
    if (d.skills)
      return d.skills.join(', ').toLowerCase();

    return '';
  }

  delete(g: any) {
    this.selProfile = g;
    this.confirmService.confirm({
      message: 'Are you sure you want to remove ' + g.name + ' from list?',
      header: 'Remove Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const data = {
          id: g.id,
          action: 'remove'
        };
        this.http.saveShortLists(data).pipe(first()).subscribe(
            () => {
              this.dataSet = this.dataSet.filter(f => f !== g);
              this.allData = this.allData.filter(f => f !== g);
              this.messageService.add({
                severity: 'success',
                summary: 'Remove Success', detail: g.name.toUpperCase() + ' removed from list!'
              });
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  request(g: any) {
    const data = {
      rid: this.loginProfile.id,
      cid: g.id,
      requested: true
    };

    this.http.saveRequest(data).pipe(first()).subscribe(res => {
      this.requested = [...this.requested, g.id];
      this.messageService.add({
        severity: 'success',
        summary: g.name + ' detail request forwarded to Admin!'
      });
    });
  }

  checkValue(event: any, g: any) {
    if (event.target.checked) {
      this.selCandidates.push(g);
    } else {
      this.selCandidates = this.selCandidates.filter(s => s !== s);
    }
  }

  requestAll() {
    if (this.selCandidates.length < 1) {
      return;
    }
    const req = [];
    this.selCandidates.forEach(c => {
      const data = {
        rid: this.loginProfile.id,
        cid: c.id,
        requested: true
      };

      req.push(data);
    });

    this.http.saveAllRequest(req).pipe(first()).subscribe(() => {
      this.requested = [...this.requested, ...req.map(r => r.cid)];

      this.selCandidates = [];

      this.messageService.add({
        severity: 'success',
        summary: 'Selected candidates request forwarded to Admin'
      });
    });
  }
}
