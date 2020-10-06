import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileStorage} from '../../storage/storage.model';
import {Personnel} from '../../members/emplyees.model';
import {ContributionsService} from '../../contributions/contributions.service';
import {Benefit, Contributions, Investment} from '../../contributions/contributions.model';
import {first, map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {Cols} from '../../admin/users.model';

@Component({
  selector: 'app-my-account',
  templateUrl: './my.account.component.html',
})
export class MyAccountComponent implements OnInit {
  @Input() personnel: Personnel;
  @Output() closeView = new EventEmitter<boolean>();
  @Output() selContribution = new EventEmitter<Contributions>();
  @Output() selDue = new EventEmitter<Contributions>();
  @Output() curDataset = new EventEmitter<Contributions[]>();
  passport: FileStorage[] = [];
  @Input() header = true;
  @Input() enableClose: boolean;
  @Input() enableDues: boolean = false;
  @Input() contributions: Contributions[];
  dataLoaded = false;
  dataSet: Contributions[] = [];
  cols: Cols[] = [];
  curInvestment: Investment;
  investmentCols: Cols[] = [];
  investmentSet: Investment[] = [];
  benefitCols: Cols[] = [];
  benefitSet: Benefit[] = [];
  view = 1;
  selInvestment: Investment;
  selBenefit: Benefit;

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
      {field: 'subscription.name', header: 'Name.'},
      {field: 'target', header: 'Target'},
      {field: 'subAmount', header: 'Sub. Amount'},
      {field: 'amount', header: 'C. Amount'},
      {field: 'subDate', header: 'Date'},
    ];

    this.investmentCols = [
      {field: 'type.name', header: 'Name'},
      {field: 'units', header: 'Unit'},
      {field: 'worth', header: 'Worth'},
      {field: 'unitPrice', header: 'Unit Price'},
      {field: 'createdAt', header: 'I. Date'},
    ];

    this.benefitCols = [
      {field: 'type.name', header: 'Name'},
      {field: 'amount', header: 'Amount'},
      {field: 'balance', header: 'Balance'},
    ];

    if (!this.contributions) {
      this.refresh();
    } else {
      this.dataSet = this.contributions;
      this.dataLoaded = true;
    }

    this.passport = [fs];

  }

  refresh() {
    forkJoin([
      this.http.getMySubs(this.personnel.id),
      this.http.getMyInvestments(this.personnel.id),
      this.http.getMyBenefits(this.personnel.id),
    ]).pipe(map(([subs, investments, benefits]) => ({subs, investments, benefits})))
      .subscribe(res => {
        this.dataSet = res.subs;
        this.investmentSet = res.investments;
        this.benefitSet = res.benefits;
        this.dataLoaded = true;
      });
  }

  closeReport() {
    this.closeView.emit(true);
  }

  print() {
    window.print();
  }

  viewDetails(data: Contributions) {
    this.selContribution.emit(data);
    this.curDataset.emit(this.dataSet);
  }

  viewInvestmentDetails(data: Investment) {
    this.selInvestment = data;
    this.view = 2;
  }

  viewBenefitDetails(data: Benefit) {
    this.selBenefit = data;
    this.view = 3;
  }

  close() {
    this.view = 1;
  }
}
