import {Component, OnInit} from '@angular/core';
import {Accounts, currencies, Currency} from '../banking.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Banks, Cols, User} from '../../admin/users.model';
import {BankingService} from '../banking.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.scss']
})
export class OpenComponent implements OnInit {

  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: Accounts[] = [];
  accountForm: FormGroup;
  title: string = '';
  banks: Banks[] = [];
  submitted = false;
  currencies: Currency[] = currencies;
  loginUser: User;
  private editCur: Accounts;
  private selBank: Banks;
  private newAccount: Accounts;

  constructor(private formBuilder: FormBuilder,
              private http: BankingService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.accountForm.controls;
  }

  ngOnInit() {
    this.loginUser = JSON.parse(sessionStorage.getItem('currentUser'));

    this.cols = [
      {field: 'name', header: 'Name'},
      {field: 'bank.name', header: 'Bank'},
      {field: 'accountNo', header: 'Account No.'},
      {field: 'openingBalance', header: 'O. Balance'},
      {field: 'balance', header: 'C. Balance'},
    ];

    this.refresh();
  }

  refresh() {
    this.http.getAccounts().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }
}
