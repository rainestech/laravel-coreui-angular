import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DomSanitizer} from '@angular/platform-browser';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Cols, User} from '../../admin/users.model';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {AccountChart, Accounts, Transactions} from '../banking.model';
import {CashbookService} from '../../cashbook/cashbook.service';
import {BankingService} from '../banking.service';

@Component({
  selector: 'app-banking-entry',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  dataLoaded = false;
  paymentForm: FormGroup;
  accounts: Accounts[] = [];
  submitted = false;
  imageSrc: any[] = [];
  curViewFile: any;
  viewTemp: BsModalRef;
  submitControl = false;
  pendingUploads: { file: File, id: number }[] = [];
  loginUser: User;
  view = 1;
  entries: Transactions[] = [];
  cols: Cols[] = [];
  dataSet: Transactions[] = [];
  payments = 0;
  receipts = 0;
  total = 0;
  difference = 0;
  parents: AccountChart[] = [];
  children: AccountChart[] = [];
  txType = false;
  private newPayment: Transactions;
  private selAccount: Accounts;
  private accountCharts: AccountChart[] = [];
  private selHead: AccountChart;
  private selChart: AccountChart;
  private docUploadCount: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private currentDoc: Observable<number[]> = this.docUploadCount.asObservable();
  private chartTxType = 'debit';
  @Output() closeView = new EventEmitter<Boolean>();
  @Output() tx = new EventEmitter<Transactions>();
  @Input() editTx: Transactions;

  constructor(private formBuilder: FormBuilder,
              private http: BankingService,
              private cashbookService: CashbookService,
              private confirmationService: ConfirmationService,
              private sanitizer: DomSanitizer,
              private modalService: BsModalService,
              private messageService: MessageService) {
  }

  get f() {
    return this.paymentForm.controls;
  }

  ngOnInit() {
    this.loginUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.getAccountCharts();
    this.initVars();
    this.initForm();
  }

  initForm() {
    const data = this.editTx ? this.editTx : new Transactions();
    this.submitted = false;
    this.paymentForm = this.formBuilder.group({
      amount: [data.amount, [Validators.required, Validators.min(0.01)]],
      remarks: [data.remarks, Validators.required],
      accounts: [data.account?.id, Validators.required],
      category: [data.category, Validators.required],
      reference: [data.reference, Validators.required],
      txDate: [data.txDate, Validators.required],
      voucherNo: [data.voucherNo, Validators.required],
      accountChart: [data.accountChart?.id, Validators.required],

      chartTxType: [this.chartTxType, Validators.required],
      chartCategory: ['', Validators.required],
    });
    this.formValueChanges();
  }

  getAccountCharts() {
    this.cashbookService.getAccType().pipe(first()).subscribe(res => {
      this.accountCharts = [...res];
      this.parents = res.filter(p => p.parent !== null && p.parent.parent === null);
    });
  }

  submit() {
    this.submitted = true;
    if (this.paymentForm.invalid) {
      return;
    }
    this.submitControl = true;
    this.newPayment = this.paymentForm.value;
    this.newPayment.account = this.selAccount;
    this.newPayment.chartTxType = this.chartTxType;
    this.newPayment.accountChart = this.selChart;
    this.addData(this.newPayment);
  }

  postTx() {
    this.submitted = true;
    if (this.paymentForm.invalid) {
      return;
    }
    this.submitControl = true;
    this.newPayment = this.paymentForm.value;
    this.newPayment.account = this.selAccount;
    this.newPayment.chartTxType = this.chartTxType;
    this.newPayment.accountChart = this.selChart;

    this.http.saveTx(this.newPayment).pipe(first()).subscribe(res => {
      this.messageService.add({
        severity: 'success', summary: 'Transaction Successful!',
        detail: 'Transaction Entry saved successfully.'
      });
      this.tx.emit(res);
      this.close(true);
    });
  }

  close(value = false) {
    if (value) {
      this.entries = [];
    }
    this.submitted = false;
    this.submitControl = false;
    this.initForm();
    this.view = 1;
    this.closeView.emit(true);
  }

  viewSummary() {
    this.entries.forEach(e => {
      if (e.txType.toUpperCase() === 'DEBIT') {
        this.receipts = this.receipts + e.amount;
      } else {
        this.payments = this.payments + e.amount;
      }
      this.total = this.entries.length;
    });

    this.dataSet = this.entries;
    this.cols = [
      {field: 'transDate', header: 'Trans. Date'},
      {field: 'amount', header: 'amount'},
      {field: 'type', header: 'Type'},
      {field: 'reference', header: 'Ref'},
    ];
    this.view = 2;
  }

  private initVars() {
    forkJoin([
      this.http.getAccounts(),
    ]).pipe(map(([accounts]) => {
      return {accounts};
    }))
      .subscribe(res => {
        this.accounts = res.accounts; // .filter(a => a.);
        this.dataLoaded = true;
      });
  }

  private formValueChanges() {
    this.paymentForm.controls['accounts'].valueChanges.subscribe(value => {
      this.selAccount = this.accounts.find(a => a.id === +value);
    });

    this.f.chartCategory.valueChanges.subscribe(value => {
      this.selHead = this.parents.find(p => p.id === +value);
      this.children = this.accountCharts.filter(a => a.parent && a.parent.id === +value);
      if (this.children.length < 1) {
        this.children.push(this.selHead);
      }
      this.txType = !this.selHead.annualReset;
    });

    this.f.accountChart.valueChanges.subscribe(value => {
      this.selChart = this.children.find(f => f.id === +value);
    });

    this.f.chartTxType.valueChanges.subscribe(value => this.chartTxType = value);
  }

  private postAll() {
    this.http.saveAllTx(this.entries).pipe(first()).subscribe(res => {
      this.messageService.add({
        severity: 'success', summary: 'Journal Successful!',
        detail: 'Journal Entries saved successfully.'
      });
      this.close(true);
    });
  }

  private addData(newPayment: Transactions) {
    newPayment.txType = newPayment.accountChart.category.type.toLocaleLowerCase();
    this.entries.push(newPayment);
    this.submitted = false;
    this.initForm();
    this.submitControl = false;
  }
}
