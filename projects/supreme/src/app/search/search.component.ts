import { Component, OnInit } from '@angular/core';
import {SearchService} from "./search.service";
import {ProfileService} from "../profile/profile.service";
import {first} from "rxjs/operators";
import {DataService} from "../service/data.service";
import {User} from "../admin/users.model";
import {FormControl, Validators} from "@angular/forms";
import {FileStorage} from "../admin/file.reader";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  skillSet: any[];
  loginUser: User;
  dataLoaded = false;
  searchForm = new FormControl('', Validators.required);
  view = 1;
  selectedTerms: string[] = [];
  response: any[] = [];
  selCandidate: any;

  constructor(private http: SearchService,
              private dataService: DataService,
              private messageService: MessageService,
              private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getSkillSet().pipe(first()).subscribe(res => {
      this.skillSet = res.map(r => r.skill);
      this.dataLoaded = true;
    });
    this.loginUser = this.dataService.getUser();

  }

  search() {
    if (this.selectedTerms.length < 1) {
      return;
    }

    const data = {skills: this.selectedTerms};

    this.http.search(data).pipe(first()).subscribe(res => {
      this.response = res;
      this.view = 2;
    })
  }

  change(event: any) {
    this.selectedTerms = [...event];
  }

  getPassport(g: any) {
    if (g.user?.passoprt) {
      return [g.user.passport];
    }

    return [new FileStorage()]
  }

  viewDetails(g: any) {
    this.selCandidate = g;
    this.view = 3;
  }

  close() {
    this.view = 2;
  }

  getUser(selProfile: any) {
    if (selProfile.user) {
      return selProfile.user;
    }

    return new User();
  }

  shortlist(event: any) {
    const data = {
      id: event.id,
      action: 'add'
    };

    this.http.saveShortLists(data).pipe(first()).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: event.name + 'shortlisted'
      });
    });
  }
}
