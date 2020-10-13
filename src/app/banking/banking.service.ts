import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Accounts, BankMonthlyLog, Reconciliation, Transactions, Transfers, TxFiles} from './banking.model';
import {Banks, Tenants, User} from '../admin/users.model';
import {Endpoints} from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class BankingService {

  private api = Endpoints.mainUrl + Endpoints.appApi + '/banking';
  private apiSetting = this.api + '/setting';
  private apiBanks = this.api;
  private apiAccounts = this.api + '/accounts';
  private apiTransfer = this.api + '/transfer';
  private apiTransactions = this.api + '/tx';
  private apiReconciliation = this.api + '/reconciliation';
  private apiFile = this.api + '/txfile';

  constructor(private http: HttpClient) {
  }

  // Banks subscription Api Calls
  getBank() {
    return this.http.get<Banks[]>(this.apiBanks)
      .pipe(map(data => data));
  }

  saveBank(data: Banks) {
    return this.http.post<Banks>(this.apiBanks, data)
      .pipe(map(res => res));
  }

  editBank(data: Banks) {
    return this.http.put<Banks>(this.apiBanks, data)
      .pipe(map(res => res));
  }

  deleteBank(data: Banks) {
    return this.http.delete<any>(this.apiBanks + '/remove/' + data.id)
      .pipe(map(res => res));
  }

  // Accounts Api Calls
  getAccounts() {
    return this.http.get<Accounts[]>(this.apiAccounts)
      .pipe(map(data => data));
  }

  saveAccounts(data: Accounts) {
    return this.http.post<Accounts>(this.apiAccounts, data)
      .pipe(map(res => res));
  }

  editAccounts(data: Accounts) {
    return this.http.put<Accounts>(this.apiAccounts, data)
      .pipe(map(res => res));
  }

  deleteAccounts(data: Accounts) {
    return this.http.delete<any>(this.apiAccounts + '/remove/' + data.id)
      .pipe(map(res => res));
  }

  // Accounts Api Calls
  getTransfer() {
    return this.http.get<Transfers[]>(this.apiTransfer)
      .pipe(map(data => data));
  }

  saveTransfer(data: Transfers) {
    return this.http.post<Transfers>(this.apiTransfer, data)
      .pipe(map(res => res));
  }

  editTransfer(data: Transfers) {
    return this.http.put<Transfers>(this.apiTransfer, data)
      .pipe(map(res => res));
  }

  deleteTransfer(data: Transfers) {
    return this.http.delete<any>(this.apiTransfer + '/remove/' + data.id)
      .pipe(map(res => res));
  }

  // Transaction Api Calls
  getTransactions() {
    return this.http.get<Transactions[]>(this.apiTransactions).pipe(map(res => res));
  }

  getTransactionsByTransfer(data: Transfers) {
    return this.http.get<Transactions[]>(this.apiTransactions + '/transfer/' + data.id).pipe(map(res => res));
  }

  getTransactionsByAcc(account: Accounts, month = '') {
    return this.http.get<Transactions[]>(this.apiTransactions + '/acc/' + account.id + '/' + month).pipe(map(res => res));
  }

  getTransactionsByAccMY(account: Accounts, month = '', year: number) {
    return this.http.get<Transactions[]>(this.apiTransactions + '/acc/' + account.id + '/' + month + '/' + year).pipe(map(res => res));
  }

  getMonthSummary(account: Accounts, month = '', year: number) {
    return this.http.get<BankMonthlyLog>(this.apiTransactions + '/monthly/' + account.id + '/' + month + '/' + year).pipe(map(res => res));
  }

  getTransactionsMY(month = '', year: number) {
    return this.http.get<Transactions[]>(this.apiTransactions + '/tx/' + month + '/' + year).pipe(map(res => res));
  }

  getTransactionsByUser(data: User, month = '') {
    return this.http.get<Transactions[]>(this.apiTransactions + '/cid/' + data.id + '/' + month).pipe(map(res => res));
  }

  getTransactionsByOrg(data: Tenants, month = '') {
    return this.http.get<Transactions[]>(this.apiTransactions + '/org/' + data.id + '/' + month).pipe(map(res => res));
  }

  // Reconciliation Api Calls
  getReconciliations() {
    return this.http.get<Reconciliation[]>(this.apiReconciliation).pipe(map(res => res));
  }

  removeReconciliation(data: Reconciliation) {
    return this.http.get<Transactions[]>(this.apiReconciliation + '/remove/' + data.id).pipe(map(res => res));
  }

  saveReconciliation(data: Reconciliation) {
    return this.http.post<Reconciliation>(this.apiReconciliation, data).pipe(map(res => res));
  }

  // Files Api Calls
  getFile(id: number) {
    return this.http.get<TxFiles>(this.apiFile + '/cid/' + id).pipe(map(res => res));
  }

  getTxFiles(id: number) {
    return this.http.get<TxFiles[]>(this.apiFile + '/tx/' + id).pipe(map(res => res));
  }

  saveTxFile(data: FormData) {
    return this.http.post<TxFiles>(this.apiFile, data)
      .pipe(map(res => res));
  }

  editTxFile(data: FormData) {
    return this.http.put<TxFiles>(this.apiFile, data)
      .pipe(map(res => res));
  }

  // Tx Api
  deleteTx(id: number) {
    return this.http.delete<Transactions>(this.api + '/rem/' + id).pipe(map(res => res));
  }

  saveAllTx(entries: Transactions[]) {
    return this.http.post<Transactions[]>(this.apiTransactions + '/all/', entries).pipe(map(res => res));
  }

  saveTx(entries: Transactions) {
    return this.http.post<Transactions>(this.apiTransactions, entries).pipe(map(res => res));
  }
}
