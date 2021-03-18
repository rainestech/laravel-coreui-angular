import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cols, User} from "../admin/users.model";
import {FileStorage} from "../admin/file.reader";
import {SearchService} from "../search/search.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() profile: any;
  @Input() user: User;
  @Input() logo: FileStorage[];
  @Input() passport: FileStorage[];
  @Input() enableClose: boolean = false;
  @Output() closed = new EventEmitter<boolean>();
  view = 1;
  dataLoaded = true;
  shortlist: any[] = [];
  searchTerms: any[] = [];
  cols: Cols[] = [];

  constructor(private http: SearchService) { }

  ngOnInit(): void {
    this.http.getRecruiterShortLists(this.profile.id).pipe(first()).subscribe(res => this.shortlist = res);
    this.http.getSearchAnalytics(this.profile.id).pipe(first()).subscribe(res => this.searchTerms = res);
    this.cols = [
      {header: 'Name', field: 'candidate.name'},
      {header: 'Email', field: 'candidate.email'},
      {header: 'Requested', field: 'requested'},
      {header: 'Approved', field: 'approved'},
      {header: 'List Date', field: 'created_at'},
    ];
  }

  close() {
    this.closed.emit(true);
  }

  print() {
    this.view = 2;
    window.print();
  }
}
