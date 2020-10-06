import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Benefit, BenefitLog, BenefitType, getPeriodLabel} from '../contributions/contributions.model';
import {Personnel} from '../members/emplyees.model';
import {DataService} from '../services/data.service';
import {Cols, User} from '../admin/users.model';
import {ContributionsService} from '../contributions/contributions.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent implements OnInit {
  dataLoaded = false;
  cols: Cols[];
  dataSet: Benefit[] = [];
  logSet: BenefitLog[] = [];
  typeCols: Cols[] = [];
  typeSet: BenefitType[] = [];
  detailsTitle: string;
  logCols: Cols[] = [];
  private loginUser: User;
  @Input() benefitType: BenefitType;
  @Input() view = 1;
  @Input() curPersonnel: Personnel;
  @Input() curBenefit: Benefit;
  @Input() enableEdit: boolean = false;

  @Output() closed = new EventEmitter<boolean>();

  constructor(private dataStore: DataService,
              private http: ContributionsService) { }

  ngOnInit(): void {
    this.loginUser = this.dataStore.getUser();
    this.cols = [
      {header: 'Name', field: 'personnel.name'},
      // {header: 'User Name', field: 'personnel.user.username'},
      {header: 'Join Date', field: 'personnel.joinDate'},
      {header: 'Work', field: 'personnel.occupation'},
      {header: 'Benefit Type', field: 'type.name'},
      {header: 'Amount', field: 'amount'},
      {header: 'Date', field: 'txDate'},
    ];

    this.typeCols.push({field: 'name', header: 'Name'});
    this.typeCols.push({field: 'description', header: 'Description'});
    this.typeCols.push({field: 'subscribers', header: 'Subscribers'});
    this.typeCols.push({field: 'amount', header: 'Rate (Amount)'});
    this.typeCols.push({field: 'period', header: 'Period'});
    this.typeCols.push({field: 'optional', header: 'Optional'});

    this.logCols = [
      {header: 'Tx. Date', field: 'txDate'},
      {header: 'Amount', field: 'amount'},
      {header: 'Balance', field: 'balance'},
    ];

    this.typeRefresh();
  }

  viewDetails(data) {
    this.http.getBenefitLogs(data.id).pipe(first()).subscribe(res => {
      this.logSet = res;
      this.view = 3;
    });
  }

  private refresh() {
    this.dataLoaded = false;
    this.http.getBenefitByTypes(this.benefitType.id).pipe(first()).subscribe(res => {
      this.dataSet = res;
      this.dataLoaded = true;
      this.view = 2;
    });
  }

  private typeRefresh() {
    this.dataLoaded = false;
    this.http.getBenefitTypes().pipe(first()).subscribe(res => {
      this.typeSet = res;
      this.dataLoaded = true;
      this.view = 1;
    });
  }

  getPeriodLabel(period: any) {
    return getPeriodLabel(period);
  }

  selType(data) {
    this.benefitType = data;
    this.refresh();
  }

  close(number: number) {
    this.closed.emit(true);
    this.view = number;
  }
}
