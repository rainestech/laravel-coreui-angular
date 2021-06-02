import {Component, OnInit, ViewChild} from '@angular/core';
import {LmsService} from "./lms.service";
import {DataService} from "../service/data.service";
import {first} from "rxjs/operators";
import {Cols} from "../admin/users.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-lms',
  templateUrl: './lms.component.html',
  styleUrls: ['./lms.component.scss']
})
export class LmsComponent implements OnInit {
  private pingUuid;
  users: any[] = [];
  allUsers: any[] = [];
  cols: Cols[] = [];
  @ViewChild('dt') dt: any;
  filter =  new FormControl('');
  title = 'All Candidates';
  paginator = true;
  rpp = [10,15,20,25];


  constructor(private http: LmsService, private dataStore: DataService) { }

  ngOnInit(): void {
    this.cols = [
      {header: 'Name', field: 'name'},
      {header: 'Email', field: 'email'},
      {header: 'Plan', field: 'subscription'},
      {header: 'Status', field: 'status'},
      {header: 'Start Date', field: 'startDate'},
      {header: 'End Date', field: 'endDate'},
    ];
    this.pingUuid = this.dataStore.getLmsToken();
    this.loadUsers();

    this.filter.valueChanges.subscribe(value => {
      if (value === 'active') {
        this.users = this.allUsers.filter(u => u.status === 'active');
        this.title = 'Active Subscribers'
      } else if (value === 'changed') {
        this.users = this.allUsers.filter(u => u.status === 'changed');
        this.title = 'Changed Subscribers'
      } else if (value === 'expired') {
        this.users = this.allUsers.filter(u => u.status === 'expired');
        this.title = 'Candidates with Expired Subscription'
      } else if (value === 'month') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => new Date(u.endDate).getMonth() === nw.getMonth() && new Date(u.endDate).getFullYear() === nw.getFullYear() && u.status === 'active');
        this.title = 'Candidates with Subscriptions Expiring this Month'
      } else if (value === 'week') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => LmsComponent.getDateDiff(new Date(u.endDate), nw) <= 7 && u.status === 'active');
        this.title = 'Candidates with Subscriptions Expiring this Week'
      } else if (value === 'today') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => new Date(u.endDate).getFullYear() === nw.getFullYear() && new Date(u.endDate).getMonth() === nw.getMonth() && new Date(u.endDate).getDate() === nw.getDate() && u.status === 'active');
        this.title = 'Candidates with Subscriptions Expiring Today'
      } else if (value === 'inactive') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => u.status === 'inactive');
        this.title = 'Candidates with In-Active Subscriptions'
      } else if (value === 'cancelled') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => u.status.includes('cancel'));
        this.title = 'Cancelled Subscriptions'
      } else {
        this.users = this.allUsers;
        this.title = 'All Candidates';
      }
    })
  }

  refresh() {
      if (this.pingUuid) {
        this.http.getUsers().pipe(first()).subscribe(res => this.users = res);
      } else {
        this.http.ping().pipe(first()).subscribe(() => {
          this.http.getUsers().pipe(first()).subscribe(res => this.users = res);
        })
      }
  }

  loadUsers() {
    this.http.proxyUsers().pipe(first()).subscribe(res => {
      this.users = this.allUsers = res;
    });
  }

  static getDateDiff(date1: Date, date2: Date) {
    const diff = date1.valueOf() - date2.valueOf();
    return Math.abs(Math.ceil(diff / (1000 * 3600 * 24)));
  }

  print() {
    if (!this.paginator) {
      window.print();
    } else {
      this.paginator = false;
    }
  }

  closePrint() {
    this.paginator = true;
  }
}
