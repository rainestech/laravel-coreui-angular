import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {Cols, setYearOpts, User} from '../../admin/users.model';
import {CashbookService} from '../../cashbook/cashbook.service';
import {DataService} from '../../services/data.service';
import {AccountChart, Charts, getRealParent, getRealParentModel} from '../../banking/banking.model';

@Component({
  selector: 'app-nominal-account',
  templateUrl: './nominal-account.component.html',
  styleUrls: ['./nominal-account.component.scss']
})
export class NominalAccountComponent implements OnInit {
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: Charts[] = [];
  loginUser: User;
  view = 1;
  title: string;
  accountForm: FormGroup;
  parents: AccountChart[] = [];
  submitted = false;
  children: AccountChart[] = [];
  years: any[] = setYearOpts();
  year: number = new Date().getFullYear();
  filterForm: FormGroup;
  private accountCharts: AccountChart[] = [];
  private selAccount: AccountChart;
  private selHead: AccountChart;
  private newAccount: Charts;
  private curAccount: Charts;

  constructor(private http: CashbookService,
              private formBuilder: FormBuilder,
              private dataStore: DataService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.accountForm.controls;
  }

  ngOnInit() {

    this.loginUser = this.dataStore.getUser();
    this.cols.push({field: 'accountChart.name', header: 'Name'});
    this.cols.push({field: 'accountChart.description', header: 'Description'});
    this.cols.push({field: 'balance', header: 'C. Balance'});
    this.cols.push({field: 'pyBalance', header: 'L.Y Balance'});
    this.cols.push({field: 'bf', header: 'B.F. Amount'});

    this.filterForm = this.formBuilder.group({
      year: [this.year]
    });

    this.filterForm.controls['year'].valueChanges.subscribe(value => {
      this.year = +value;
      this.refresh();
    });

    this.refresh();
    this.getAccountCharts();
  }

  edit(data: Charts = null) {
    // console.log(data);
    if (data === null) {
      this.accountForm = this.formBuilder.group({
        accountChart: ['', Validators.required],
        head: ['', Validators.required],
        year: ['', Validators.required],
        pyBalance: ['', Validators.required],
        balance: ['', Validators.required],
      });
      this.title = 'Add New Nominal Account';
    } else {
      this.accountForm = this.formBuilder.group({
        id: [data.id, Validators.required],
        accountChart: [data.accountChart.id, Validators.required],
        head: [getRealParent(data.accountChart), Validators.required],
        year: [data.year, Validators.required],
        pyBalance: [data.pyBalance, Validators.required],
        balance: [data.balance, Validators.required],
      });
      this.title = 'Edit Nominal Account: ' + data.accountChart.name;
      this.selAccount = data.accountChart;
      this.year = data.year;
      this.selHead = getRealParentModel(data.accountChart) ? getRealParentModel(data.accountChart) : data.accountChart;
      this.children = this.accountCharts.filter(a => a.parent && a.parent.id === this.selHead.id);
      if (this.children.length < 1) {
        this.children.push(this.selHead);
      }
    }

    this.formValueChanges();
    this.view = 2;
  }

  formValueChanges() {
    this.f.head.valueChanges.subscribe(value => {
      this.selHead = this.parents.find(p => p.id === +value);
      this.children = this.accountCharts.filter(a => a.parent && a.parent.id === +value);
      // console.log(this.children.length);
      if (this.children.length < 1) {
        this.children.push(this.selHead);
      }
    });

    this.f.accountChart.valueChanges.subscribe(value => {
      this.selAccount = this.children.find(f => f.id === +value);
    });
  }

  refresh() {
    this.http.getCharts(this.year).pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  getAccountCharts() {
    this.http.getAccType().pipe(first()).subscribe(res => {
      this.accountCharts = [...res];
      this.parents = res.filter(p => p.parent !== null && p.parent.parent === null);
    });
  }

  del(data: Charts) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete: ' + data.accountChart.name + ' Account?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteCharts(data).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Success',
              detail: data.accountChart.name + ' Account Removed from Database!'
            });
          });
      },
      reject: () => {
        return;
      }
    });
  }

  close() {
    this.view = 1;
  }

  onSubmit() {
    this.submitted = true;
    if (this.accountForm.invalid) {
      return;
    }
    this.newAccount = this.accountForm.value;
    this.newAccount.accountChart = this.selAccount;
    this.newAccount.bf = this.newAccount.balance;
    if (this.newAccount.id) {
      this.put();
    } else {
      this.post();
    }
  }

  put() {
    const oldDataSet = [...this.dataSet];
    this.http.editChart(this.newAccount).pipe(first()).subscribe(res => {
      this.view = 1;
      this.submitted = false;
      oldDataSet[this.dataSet.indexOf(this.dataSet.find(d => d.id === res.id))] = res;
      this.dataSet = oldDataSet;
      this.messageService.add({severity: 'success', summary: 'Update Success', detail: res.accountChart.name + ' Updated!'});
    });
  }

  post() {
    this.http.saveChart(this.newAccount).pipe(first()).subscribe(res => {
      this.dataSet.push(res);
      this.view = 1;
      this.submitted = false;
      this.messageService.add({severity: 'success', summary: 'Save Success', detail: res.accountChart.name + ' Saved successfully!'});
    });
  }
}
