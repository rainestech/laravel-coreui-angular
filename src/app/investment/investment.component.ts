import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DividendLog, Investment, InvestmentLog, InvestmentType} from '../contributions/contributions.model';
import {DataService} from '../services/data.service';
import {ContributionsService} from '../contributions/contributions.service';
import {Cols, User} from '../admin/users.model';
import {first} from 'rxjs/operators';
import {Personnel} from '../members/emplyees.model';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss']
})
export class InvestmentComponent implements OnInit {

  @Output() closed = new EventEmitter<Boolean>();
  @Input() view = 1;
  @Input() curInvestment: Investment;
  @Input() detailHeader = true;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: InvestmentType[] = [];
  loginUser: User;
  selInvestmentType: InvestmentType;
  investmentSet: Investment[] = [];
  investmentCols: Cols[] = [];
  logSet: InvestmentLog[] = [];
  detailsTitle: string;
  logCols: Cols[] = [];
  dividendCols: Cols[] = [];
  dividendSet: DividendLog[] = [];
  personnel: Personnel;
  constructor(private dataStore: DataService,
              private http: ContributionsService) { }

  ngOnInit(): void {
    this.loginUser = this.dataStore.getUser();

    this.cols.push({field: 'name', header: 'Name'});
    this.cols.push({field: 'amount', header: 'I. Amount'});
    this.cols.push({field: 'totalUnits', header: 'T. Units'});
    this.cols.push({field: 'initPrice', header: 'Unit Price'});
    this.cols.push({field: 'availableUnits', header: 'Available'});
    this.cols.push({field: 'maturityDate', header: 'Maturity'});
    this.cols.push({field: 'subscribers', header: 'Investors'});

    this.investmentCols = [
      {header: 'M Name', field: 'personnel.name'},
      {header: 'Occupation', field: 'personnel.occupation'},
      {header: 'I. Type', field: 'type.name'},
      {header: 'I. Date', field: 'createdAt'},
      {header: 'Units', field: 'units'},
      {header: 'Worth', field: 'worth'},
    ];

    this.refresh();
  }

  refresh() {
    this.dataLoaded = false;
    this.http.getInvestmentTypes().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  close(no: number) {
    this.closed.emit(true);
    this.view = no;
  }

  selType(data: InvestmentType) {
    this.selInvestmentType = data;
    this.getInvestments();
  }

  getInvestments() {
    this.view = 2;
    this.dataLoaded = false;
    this.http.getInvestmentByTypes(this.selInvestmentType.id).pipe(first()).subscribe(res => {
      this.investmentSet = res;
      this.dataLoaded = true;
    });
  }

  viewDetails(data: Investment) {
    this.curInvestment = data;
    this.getLogs();
  }

  getLogs() {
    this.view = 3;
    this.dataLoaded = false;
    this.http.getInvestmentLog(this.curInvestment.id).pipe(first()).subscribe(res => {
      this.logSet = res;
      this.dataLoaded = true;
    });
  }
}
