import {Component, OnInit} from '@angular/core';
import {Accounts, getBudgetRemBal, Transactions} from '../banking.model';
import {Cols, User} from '../../admin/users.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BankingService} from '../banking.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  view = 1;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: Transactions[] = [];
  loginUser: User;
  accounts: Accounts[] = [];
  filterForm: FormGroup;
  curTx: Transactions;

  constructor(private formBuilder: FormBuilder,
              private http: BankingService,
              private dataStore: DataService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.loginUser = this.dataStore.getUser();

    this.cols = [
      {field: 'txDate', header: 'Date'},
      {field: 'accounts.name', header: 'Account'},
      {field: 'amount', header: 'Amount'},
      {field: 'balance', header: 'Balance'},
      {field: 'txType', header: 'Tx. Type'},
      {field: 'voucherNo', header: 'Voucher No.'},
    ];

    this.filterForm = this.formBuilder.group({
      account: ['']
    });

    this.filterFormChanges();

    this.getAccounts();
    this.refresh();
  }

  refresh() {
    this.http.getTransactions().pipe(first()).subscribe(res => {
      this.dataSet = [...res.filter(r => r.editor.id === this.loginUser.id && r.transfer)];
      this.dataLoaded = true;
    });
  }

  close() {
    this.view = 1;
  }

  txDetails(data: Transactions) {
    this.curTx = data;
    this.view = 2;
  }

  deleteTx(data: Transactions) {
    const tx = data.accountChart ? data.accountChart.name : data.category;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + tx + ' Transaction record?' +
        ' Note that this will reverse earlier computations on this transaction',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteTx(data.id).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success', summary: 'Delete Success',
              detail: tx + ' transaction record Removed from Database!'
            });
          });
      },
      reject: () => {
        return;
      }
    });
  }

  getBudgetRemBal() {
    return getBudgetRemBal(this.curTx);
  }

  fileDetails() {

  }

  private getAccounts() {
    this.http.getAccounts().pipe(first()).subscribe(res => this.accounts = res);
  }

  private filterFormChanges() {
    this.filterForm.controls['account'].valueChanges.subscribe(res => {
      this.dataLoaded = false;
      this.http.getTransactionsByAcc(this.accounts.find(a => a.id === +res)).pipe(first()).subscribe(data => {
        this.dataSet = [...data];
        this.dataLoaded = true;
      });
    });
  }
}
