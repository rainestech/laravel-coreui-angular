import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cols, User} from "../admin/users.model";
import {FileStorage} from "../admin/file.reader";
import {SearchService} from "../search/search.service";
import {first} from "rxjs/operators";
import {ConfirmationService, MessageService} from "primeng/api";

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

  constructor(private http: SearchService, private confirmService: ConfirmationService, private messageService: MessageService) { }

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
    window.print();
  }

  toggleRequest(data: any) {
    this.confirmService.confirm({
      message: data.approved ? 'Are you sure you want to disapprove request?' : 'Are you sure you want to approve request?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.toggleRequestApproval(data.id).pipe(first()).subscribe(
            res => {
              this.shortlist[this.shortlist.indexOf(this.shortlist.find(s => s.id === data.id))] = res;

              this.messageService.add(
                  {severity: 'success', summary: 'Request Status updated'});
            });
      },
      reject: () => {
        return;
      }
    });
  }
}
