import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {Banks, Cols, User} from '../../../admin/users.model';
import {DataService} from '../../../services/data.service';
import {BankingService} from '../../../banking/banking.service';
import {Accounts, currencies, Currency} from '../../../banking/banking.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: Accounts[] = [];
  accountForm: FormGroup;
  addEdit: BsModalRef;
  title: string = '';
  banks: Banks[] = [];
  submitted = false;
  currencies: Currency[] = currencies;
  loginUser: User;
  private editCur: Accounts;
  private selBank: Banks;
  private newAccount: Accounts;

  constructor(private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private http: BankingService,
              private dataStore: DataService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.accountForm.controls;
  }

  ngOnInit() {
    this.loginUser = this.dataStore.getUser();

    this.cols = [
      {field: 'name', header: 'Name'},
      {field: 'bankName.name', header: 'Bank'},
      {field: 'accountNo', header: 'Account No.'},
      {field: 'openingBalance', header: 'O. Balance'},
      {field: 'currBalance', header: 'C. Balance'},
    ];

    this.refresh();
    this.getBanks();
  }

  edit(addTemp: TemplateRef<any>, data: Accounts) {
    if (!data) {
      this.accountForm = this.formBuilder.group({
        bank: ['', Validators.required],
        accountNo: ['', Validators.required],
        address: ['', Validators.required],
        phoneNo: ['', Validators.required],
        manager: ['', Validators.required],
        openingBalance: ['', Validators.required],
        currency: ['', Validators.required],
        sortCode: ['', Validators.required],
        name: ['', Validators.required],

      });

      this.title = 'Add new Account';
    } else {
      this.accountForm = this.formBuilder.group({
        bank: [data.bank.id, Validators.required],
        accountNo: [data.accountNo, Validators.required],
        address: [data.bankAddress, Validators.required],
        phoneNo: [data.phoneNo, Validators.required],
        manager: [data.manager, Validators.required],
        openingBalance: [data.openingBalance, Validators.required],
        currency: [data.currency, Validators.required],
        sortCode: [data.sortCode, Validators.required],
        name: [data.name, Validators.required],
        id: [data.id, Validators.required],
      });
      this.title = 'Edit ' + data.bank + ' Account';
      this.editCur = data;
      this.selBank = data.bank;
    }
    this.formValueChanges();
    this.addEdit = this.modalService.show(addTemp, {class: 'modal-lg'});
  }

  formValueChanges() {
    this.accountForm.controls['bank'].valueChanges.subscribe(
      value => {
        this.selBank = this.banks.find(b => b.id === +value);
      });
  }

  refresh() {
    this.http.getAccounts().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  del(data: Accounts) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Account: ' + data.bank.name + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteAccounts(data).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Success', detail: data.bank.name + ' Removed from Database!'
            });
          });
      },
      reject: () => {
        return;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.accountForm.invalid) {
      return;
    } else {
      this.newAccount = this.accountForm.value;
      this.newAccount.bank = this.selBank;
      this.newAccount.status = true;
      this.newAccount.balance = this.newAccount.openingBalance;
      if (this.newAccount.id) {
        this.put();
      } else {
        this.post();
      }
    }
  }

  private put() {
    const oldDataSet = [...this.dataSet];
    this.http.editAccounts(this.newAccount).pipe(first()).subscribe(res => {
      oldDataSet[this.dataSet.indexOf(this.editCur)] = res;
      this.dataSet = oldDataSet;
      this.addEdit.hide();
      this.messageService.add({severity: 'success', summary: 'Update Success', detail: this.newAccount.bank.name + ' Updated!'});
    });
  }

  private post() {
    this.http.saveAccounts(this.newAccount).pipe(first()).subscribe(res => {
      this.dataSet.push(res);
      this.addEdit.hide();
      this.messageService.add({severity: 'success', summary: 'Add Success', detail: this.newAccount.bank.name + ' Saved!'});
    });
  }

  private getBanks() {
    this.http.getBank().pipe(first()).subscribe(res => {
      this.banks = res;
    });
  }
}

