import {Component, OnInit} from '@angular/core';
import {Assets, Contributions, Payments} from './contributions.model';
import {ContributionsService} from './contributions.service';
import {first} from 'rxjs/operators';
import {Personnel} from '../members/emplyees.model';
import {Cols} from '../admin/users.model';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.scss']
})
export class ContributionsComponent implements OnInit {
  view = 1;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: any[] = [];
  personnel: Personnel;
  contributions: Contributions[];
  selSub: Contributions;
  curDue: Contributions;
  curPayments: Payments[];
  selLog: Payments;

  constructor(private http: ContributionsService) {
  }

  ngOnInit(): void {
    this.cols = [
      {field: 'name', header: 'Name'},
      {field: 'user.username', header: 'Username'},
      {field: 'joinDate', header: 'M. Date'},
      {field: 'occupation.name', header: 'Work'},
      {field: 'subs', header: 'Subs'},
      {field: 'total', header: 'Assets'},
    ];

    this.refresh();
  }

  refresh() {
    this.http.getAccounts().pipe(first()).subscribe(res => {
      this.dataSet = res;
      this.dataLoaded = true;
    });
  }

  viewDetails(data: any) {
    this.personnel = data;
    this.contributions = data.assets;
    this.view = 2;
  }

  getSubs(data: Assets) {
    if (data.assets) {
      return data.assets.length;
    }
    return 0;
  }

  getAssets(data: Assets) {
    if (data.assets) {
      return data.assets.reduce((a, b) => a + b.amount, 0);
    }
    return 0;
  }

  close(no: number = 1) {
    if (no === 1) {
      this.contributions = null;
      this.personnel = null;
    }

    if (no === 1) {
      this.curPayments = null;
      this.selSub = null;
    }
    this.view = no;
  }

  selContribution(event: Contributions) {
    this.selSub = event;
    this.view = 3;
  }

  curDataSet(events: Contributions[]) {
    this.contributions = events;
  }

  selDue(event: Contributions) {
    this.curDue = event;
  }

  selPayment(event: Payments) {
    this.selLog = event;
  }

  curPaymentDataSet(event: Payments[]) {
    this.curPayments = event;
  }

  makePayment() {

  }
}
