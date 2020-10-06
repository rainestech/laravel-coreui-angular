import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileStorage} from '../../storage/storage.model';
import {Personnel} from '../../members/emplyees.model';
import {ContributionsService} from '../../contributions/contributions.service';
import {Contributions, Payments} from '../../contributions/contributions.model';
import {first} from 'rxjs/operators';
import {Cols} from '../../admin/users.model';

@Component({
  selector: 'app-my-payments',
  templateUrl: './payment.logs.component.html',
})
export class PaymentLogsComponent implements OnInit {
  @Input() personnel: Personnel;
  @Output() closeView = new EventEmitter<boolean>();
  @Output() selLog = new EventEmitter<Payments>();
  @Output() curDataset = new EventEmitter<Payments[]>();
  @Output() newPayment = new EventEmitter<boolean>();
  passport: FileStorage[] = [];
  @Input() header = true;
  @Input() payments: Payments[];
  dataLoaded = false;
  dataSet: Payments[] = [];
  cols: Cols[] = [];
  @Input() subType: Contributions;
  @Input() enablePayment: boolean;

  constructor(private http: ContributionsService) {
  }

  ngOnInit(): void {
    let fs = this.personnel.user.passport;
    if (!fs) {
      fs = new FileStorage();
      fs.tag = 'passport';
      fs.objID = this.personnel.user.id;
    }

    this.cols = [
      {field: 'amount', header: 'P. Amount'},
      {field: 'channel', header: 'Channel'},
      {field: 'ref', header: 'Ref.'},
      {field: 'prevBalance', header: 'P. Balance'},
      {field: 'balance', header: 'Balance'},
      {field: 'txDate', header: 'Date'},
    ];

    if (!this.payments) {
      this.refresh();
    } else {
      this.dataSet = this.payments;
      this.dataLoaded = true;
    }

    this.passport = [fs];

  }

  refresh() {
    if (this.subType) {
      this.http.getMyPaymentByContribution(this.subType.id).pipe(first()).subscribe(res => {
        this.dataSet = [...res];
        this.dataLoaded = true;
      });
    } else {
      this.http.getMyPayments(this.personnel.id).pipe(first()).subscribe(res => {
        this.dataSet = [...res];
        this.dataLoaded = true;
      });
    }

  }

  closeReport() {
    this.closeView.emit(true);
  }

  print() {
    window.print();
  }

  viewDetails(data: Payments) {
    this.selLog.emit(data);
    this.curDataset.emit(this.dataSet);
  }

  makePayment() {
    this.newPayment.emit(true);
  }

  getTotalAmount() {
    if (this.subType) {
      return this.subType.amount;
    } else {
      return this.dataSet.reduce((a, b) => a + b.amount, 0);
    }
  }
}
