import {Component, OnInit} from '@angular/core';
import {Accounts, months, Reconciliation, Transactions} from '../banking.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cols, getYears, User} from '../../admin/users.model';
import {BankingService} from '../banking.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.scss']
})
export class ReconciliationComponent implements OnInit {
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: Reconciliation[] = [];
  filterForm: FormGroup;
  accounts: Accounts[] = [];
  view = 1;
  top = 'top';
  months: string[] = months;
  selMonth: string;
  selAccount: Accounts;
  calcAmount: number = 0.00;
  monthOpt: string[] = [];
  txCols: Cols[] = [];
  edited: Transactions;
  years = getYears();
  balanceBF: number = 0;
  monthEndBalance: number = 0;
  totalDebit: number = 0;
  totalCredit: number = 0;
  effectiveDifference: number = 0;
  balanceForm: FormGroup;
  closingBalance: number = 0;
  enableRec = false;
  arrayBuffer: any;
  file: File;
  private loginUser: User;
  private txData: Transactions[] = [];
  private doneMonths: Reconciliation[];
  private monthOpts: string[] = [];
  private selYear: number;
  // setYearOpts();
  private firstTx: Transactions;
  private lastTx: Transactions;

  constructor(private formBuilder: FormBuilder,
              private http: BankingService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.balanceForm.controls;
  }

  ngOnInit() {
    this.loginUser = JSON.parse(sessionStorage.getItem('currentUser'));

    this.cols = [
      {field: 'month', header: 'Month'},
      {field: 'accounts.name', header: 'Account'},
      {field: 'closingBalance', header: 'Closing Balance'},
      {field: 'clearAmount', header: 'Cleared Amount'},
      {field: 'difference', header: 'Difference'},
      {field: 'reconciled', header: 'Done'},
    ];

    this.refresh();
  }

  refresh() {
    this.http.getReconciliations().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.doneMonths = res.filter((a, i) => res.findIndex(b => b.month === a.month) === i);
      if (res.length > 1) {
        this.doneMonths.forEach(d => {
          this.monthOpts = this.months.filter(m => m !== d.month);
        });
        this.monthOpt.push(this.monthOpts[0]);
        this.monthOpts = this.monthOpts.filter(m => m !== this.monthOpt[0]);
      } else {
        this.monthOpt = this.months;
      }
      this.getAccounts();
      this.dataLoaded = true;
    });
  }

  close() {
    this.view = 1;
  }

  new() {
    this.txCols = [
      {field: 'transDate', header: 'Trans. Date'},
      {field: 'budget.name', header: 'Item Name'},
      {field: 'amount', header: 'amount'},
      {field: 'type', header: 'Type'},
      {field: 'reference', header: 'Ref'},
    ];

    this.filterForm = this.formBuilder.group({
      month: [''],
      year: [''],
      account: [''],
    });

    this.balanceForm = this.formBuilder.group({
      balance: ['', Validators.required]
    });

    this.filterFormValueChanges();
    this.view = 2;
  }

  getSummary() {
    this.http.getMonthSummary(this.selAccount, this.selMonth, this.selYear).pipe(first()).subscribe(res => {
      if (res) {
        this.totalDebit = res.debitBalance;
        this.totalCredit = res.creditBalance;
        this.effectiveDifference = this.totalDebit - this.totalCredit;
        this.balanceBF = res.bfBalance;
        this.monthEndBalance = res.balance;
      }
    });
  }

  onFileInput(event: any) {
    const fileReader = new FileReader();
    // fileReader.onload = (e) => {
    //   this.arrayBuffer = fileReader.result;
    //   const data = new Uint8Array(this.arrayBuffer);
    //   const arr = [];
    //   for (let i = 15; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
    //   const bstr = arr.join('');
    //   const workbook = XLSX.read(bstr, {subscription: 'binary'});
    //   const first_sheet_name = workbook.SheetNames[0];
    //   const worksheet = workbook.Sheets[first_sheet_name];
    //   console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
    // };
    //
    // fileReader.readAsArrayBuffer(event.target.files[0]);

    fileReader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      // this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
      console.log((XLSX.utils.sheet_to_json(ws, {header: 1})));
    };
    fileReader.readAsBinaryString(event.target.files[0]);
  }

  reconcile() {
    const recData = new Reconciliation();
    recData.month = this.selMonth;
    recData.year = '' + this.selYear;
    recData.accounts = this.selAccount;
    recData.balanceBF = this.balanceBF;
    recData.clearAmount = this.monthEndBalance;
    recData.closingBalance = this.closingBalance;
    recData.totalCredit = this.totalCredit;
    recData.totalDebit = this.totalDebit;
    recData.transactions = this.txData;
    recData.difference = this.closingBalance - this.monthEndBalance;
    recData.reconciled = true;

    this.http.saveReconciliation(recData).pipe(first()).subscribe(res => {
      this.dataSet.push(res);
      this.messageService.add({
        severity: 'success',
        summary: 'Reconciliation Success!',
        detail: this.selMonth + ', ' + this.selYear + this.selAccount.name +
          ' account has been successfully reconciled!'
      });
    });
  }

  private getAccounts() {
    this.http.getAccounts().pipe(first()).subscribe(res => {
      this.accounts = [...res];
    });
  }

  private filterFormValueChanges() {
    this.filterForm.controls['month'].valueChanges.subscribe(value => {
      this.selMonth = value;
      this.getTx();
    });

    this.filterForm.controls['year'].valueChanges.subscribe(value => {
      this.selYear = +value;
      this.getTx();
    });

    this.filterForm.controls['account'].valueChanges.subscribe(value => {
      this.selAccount = this.accounts.find(a => a.id === +value);
      this.getTx();
    });

    this.balanceForm.controls['balance'].valueChanges.subscribe(value => {
      this.closingBalance = +value;
      this.enableRec = !!(+value);
    });
  }

  private getTx() {
    if (this.selMonth && this.selYear && this.selAccount) {
      this.getSummary();
      this.http.getTransactionsByAccMY(this.selAccount, this.selMonth, this.selYear).pipe(first()).subscribe(res => {
        this.txData = [...res];
        if (res.length > 0) {
          // this.firstTx = res[0];
          // this.lastTx = res[res.length - 1];
          // this.totalDebit = res.filter(r => r.subscription.toLocaleLowerCase().includes('credit')).reduce((a, b) => +a + +b.amount, 0);
          // this.totalCredit = res.filter(r => r.subscription.toLocaleLowerCase().includes('debit')).reduce((a, b) => +a + +b.amount, 0);
          // this.edited = this.txData.find(r => r.edited === true);
          // this.balanceBF = this.firstTx.subscription.toLocaleLowerCase() === 'credit' ?
          //   this.firstTx.balance - this.firstTx.amount : this.firstTx.balance + this.firstTx.amount;

          // this.monthEndBalance = this.lastTx.balance;
          // this.effectiveDifference = this.totalCredit - this.totalDebit;
        }
      });
    }
  }
}
