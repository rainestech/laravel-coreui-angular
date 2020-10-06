import {Component, OnInit} from '@angular/core';
import {Accounts, Transactions, Transfers} from '../banking.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BankingService} from '../banking.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Cols, User} from '../../admin/users.model';
import {first, map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class TransfersComponent implements OnInit {
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: Transfers[] = [];
  loginUser: User;
  view = 1;
  submitted = false;
  transferForm: FormGroup;
  accountOpts: Accounts[] = [];
  accounts: Accounts[] = [];
  submitControl = false;
  curCredit: Transactions;
  curDebit: Transactions;
  private selFromAccount: Accounts;
  private selToAccount: Accounts;
  private currEdit: Transfers;
  private newTransfer: Transfers;

  constructor(private formBuilder: FormBuilder,
              private http: BankingService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.transferForm.controls;
  }

  ngOnInit() {
    this.loginUser = JSON.parse(sessionStorage.getItem('currentUser'));

    this.cols = [
      {field: 'txDate', header: 'Date'},
      {field: 'fromAccount.name', header: 'From'},
      {field: 'toAccount.name', header: 'To'},
      {field: 'amount', header: 'Amount'},
      {field: 'description', header: 'Particulars'},
    ];

    this.refresh();
    this.getAccounts();
  }

  refresh() {
    this.http.getTransfer().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  close() {
    this.submitControl = false;
    this.view = 1;
  }

  new(data: Transfers = null) {
    this.submitControl = false;
    if (data === null) {
      this.transferForm = this.formBuilder.group({
        toAccount: ['', Validators.required],
        fromAccount: ['', Validators.required],
        txDate: ['', Validators.required],
        description: ['', Validators.required],
        reference: ['', Validators.required],
        amount: ['', [Validators.required, Validators.min(0.01)]],
      });
    } else {
      this.transferForm = this.formBuilder.group({
        id: [data.id, Validators.required],
        toAccount: [data.toAccount.id, Validators.required],
        fromAccount: [data.fromAccount.id, Validators.required],
        txDate: [new Date(data.txDate), Validators.required],
        description: [data.description, Validators.required],
        reference: [data.reference, Validators.required],
        amount: [data.amount, [Validators.required, Validators.min(0.01)]],
      });

      this.selFromAccount = data.fromAccount;
      this.selToAccount = data.toAccount;
      this.currEdit = data;
    }

    this.formValueChanges();
    this.view = 2;
  }

  submit() {
    this.submitted = true;
    if (this.transferForm.invalid) {
      return;
    }
    this.submitControl = true;
    this.newTransfer = this.transferForm.value;
    this.newTransfer.toAccount = this.selToAccount;
    this.newTransfer.fromAccount = this.selFromAccount;
    if (this.newTransfer.id) {
      this.put();
    } else {
      this.post();
    }
  }

  post() {
    this.http.saveTransfer(this.newTransfer).pipe(first()).subscribe(res => {
      this.dataSet.push(res);
      this.close();
      this.messageService.add({
        severity: 'success',
        summary: 'Transfer Success',
        detail: res.amount + ' Transferred from ' + res.fromAccount.name + ' to ' + res.toAccount.name + ' successful'
      });
    }, () => { this.submitControl = false; });
  }

  put() {
    this.http.editTransfer(this.newTransfer).pipe(first()).subscribe(res => {
      const oldData = this.dataSet;
      oldData[this.dataSet.indexOf(this.currEdit)] = res;
      this.dataSet = oldData;
      this.close();
      this.messageService.add({
        severity: 'success',
        summary: 'Transfer Edit Success',
        detail: res.amount + ' transferred from ' + res.fromAccount.name + ' to ' + res.toAccount.name + ' edit successful!'
      });
    }, () => { this.submitControl = false; });
  }

  deleteTransfer(data: Transfers) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected Transfer record?' +
        ' Note that this will also remove the associated transactions',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteTransfer(data).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success', summary: 'Delete Success',
              detail: 'Transfer record Removed from Database!'
            });
          });
      },
      reject: () => {
        return;
      }
    });
  }

  detailTransfer(data) {
    this.currEdit = data;
    this.http.getTransactionsByTransfer(data).pipe(first()).subscribe(res => {
      this.curCredit = res.find(r => r.txType.toLowerCase() === 'credit');
      this.curDebit = res.find(r => r.txType === 'debit');
      this.view = 3;
    });
  }

  private getAccounts() {
    forkJoin([
      this.http.getAccounts()
    ]).pipe(map(([account]) => ({account})))
      .subscribe(res => {
        this.accounts = [...res.account];
      });
  }

  private formValueChanges() {
    this.transferForm.controls['fromAccount'].valueChanges.subscribe(value => {
      this.selFromAccount = this.accounts.find(a => a.id === +value);
      this.accountOpts = this.accounts.filter(a => a.currency === this.selFromAccount.currency && a.id !== this.selFromAccount.id);
    });

    this.transferForm.controls['toAccount'].valueChanges.subscribe(value => {
      this.selToAccount = this.accountOpts.find(a => a.id === +value);
    });
  }
}
