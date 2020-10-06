import {Component, OnInit} from '@angular/core';
import {Assets, Payments} from '../contributions.model';
import {Personnel} from '../../members/emplyees.model';
import {ContributionsService} from '../contributions.service';
import {first} from 'rxjs/operators';
import {Cols} from '../../admin/users.model';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  view = 1;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: Assets[] = [];
  personnel: Personnel;
  curDataSet: Payments[];
  selPay: Payments;

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
    this.view = no;
  }

  selPayments(event: Payments) {
    this.selPay = new Payments();
  }

  curPayments($event: Payments[]) {

  }
}
