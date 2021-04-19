import { Component, OnInit } from '@angular/core';
import {SearchService} from "./search.service";
import {ProfileService} from "../profile/profile.service";
import {first} from "rxjs/operators";
import {DataService} from "../service/data.service";
import {User} from "../admin/users.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FileStorage} from "../admin/file.reader";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  skillSet: any[];
  allSkill: any[];
  loginUser: User;
  dataLoaded = false;
  searchForm = new FormControl('', Validators.required);
  view = 1;
  selectedTerms: string[] = [];
  response: any[] = [];
  selCandidate: any;
  searchGroup: FormGroup;

  constructor(private http: SearchService,
              private dataService: DataService,
              private formBuilder: FormBuilder,
              private messageService: MessageService,
              private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getSkillSet().pipe(first()).subscribe(res => {
      this.skillSet = res.map(r => r.skill);
      this.allSkill = res.map(r => r.skill);
      this.dataLoaded = true;
    });
    this.loginUser = this.dataService.getUser();
    this.searchGroup = this.formBuilder.group({
      terms: ['', Validators.required]
    })

  }

  search() {
    if (this.searchGroup.invalid) {
      return;
    }

    const selSkills = this.searchGroup.controls.terms.value.map(s => s.value);
    console.log(selSkills);
    const data = {skills: selSkills};

    this.http.search(data).pipe(first()).subscribe(res => {
      this.response = res;
      this.view = 2;
    })
  }

  change(event: any) {
    if (this.selectedTerms.length < 6) {
      this.selectedTerms = [...event];
    } else {
      this.messageService.add({
        severity: 'warning',
        summary: 'Maximum of 5 skillset combinations allowed'
      });
    }
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
        summary: event.name + ' shortlisted'
      });
    });
  }
}
