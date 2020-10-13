import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  Assets,
  Benefit,
  BenefitLog,
  BenefitType,
  Contributions,
  ContributionType, Investment, InvestmentLog,
  InvestmentType,
  Payments,
  TransferSubs
} from './contributions.model';
import {Endpoints} from '../endpoints';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContributionsService {
  private api = Endpoints.mainUrl + Endpoints.appApi + '/_subs';
  private apiContributions = this.api + '/contributions';
  private apiBenefit = this.api + '/benefit';
  private apiInvestment = this.api + '/investment';
  private apiPayments = this.api + '/logs';
  private apiTransfer = this.api + '/transfer';
  private apiType = this.api + '/type';

  constructor(private http: HttpClient) {
  }

  // Types api
  getTypes() {
    return this.http.get<ContributionType[]>(this.apiType).pipe(map(res => res));
  }

  saveType(data: ContributionType) {
    return this.http.post<ContributionType>(this.apiType, data).pipe(map(res => res));
  }

  editType(data: ContributionType) {
    return this.http.put<ContributionType>(this.apiType, data).pipe(map(res => res));
  }

  deleteType(id: number) {
    return this.http.delete<ContributionType>(this.apiType + '/rem/' + id).pipe(map(res => res));
  }

  // Benefit Types api
  getBenefitTypes() {
    return this.http.get<BenefitType[]>(this.api + '/benefitType').pipe(map(res => res));
  }

  getBenefitByTypes(typeId: number) {
    return this.http.get<Benefit[]>(this.api + '/benefits/type/' + typeId).pipe(map(res => res));
  }

  getBenefitLogs(benefitId) {
    return this.http.get<BenefitLog[]>(this.api + '/benefits/log/' + benefitId).pipe(map(res => res));
  }

  getBenefitByPersonnel(personnelId: number) {
    return this.http.get<Benefit[]>(this.api + '/benefits/personnel/' + personnelId).pipe(map(res => res));
  }

  saveBenefitType(data: BenefitType) {
    return this.http.post<BenefitType>(this.api + '/benefitType', data).pipe(map(res => res));
  }

  editBenefitType(data: BenefitType) {
    return this.http.put<BenefitType>(this.api + '/benefitType', data).pipe(map(res => res));
  }

  deleteBenefitType(id: number) {
    return this.http.delete<BenefitType>(this.api + '/benefitType/rem/' + id).pipe(map(res => res));
  }

  // Investment Types api
  getInvestmentTypes() {
    return this.http.get<InvestmentType[]>(this.api + '/investmentType').pipe(map(res => res));
  }

  getInvestmentByTypes(typeId: number) {
    return this.http.get<Investment[]>(this.api + '/investment/type/' + typeId).pipe(map(res => res));
  }

  getInvestmentLog(investmentId: number) {
    return this.http.get<InvestmentLog[]>(this.api + '/investment/log/' + investmentId).pipe(map(res => res));
  }

  saveInvestmentType(data: InvestmentType) {
    return this.http.post<InvestmentType>(this.api + '/investmentType', data).pipe(map(res => res));
  }

  editInvestmentType(data: InvestmentType) {
    return this.http.put<InvestmentType>(this.api + '/investmentType', data).pipe(map(res => res));
  }

  deleteInvestmentType(id: number) {
    return this.http.delete<InvestmentType>(this.api + '/investmentType/rem/' + id).pipe(map(res => res));
  }

  // Subs api
  getSubs() {
    return this.http.get<Contributions[]>(this.apiContributions).pipe(map(res => res));
  }

  getMySubs(personnelID) {
    return this.http.get<Contributions[]>(this.apiContributions + '/uid/' + personnelID).pipe(map(res => res));
  }

  getCurrentPersonnelSub() {
    return this.http.get<Contributions[]>(this.apiContributions + '/me').pipe(map(res => res));
  }

  getMyInvestments(personnelID) {
    return this.http.get<Investment[]>(this.api + '/investment/personnel/' + personnelID).pipe(map(res => res));
  }

  getMyBenefits(personnelID) {
    return this.http.get<Benefit[]>(this.api + '/benefits/personnel/' + personnelID).pipe(map(res => res));
  }

  getAccounts() {
    return this.http.get<Assets[]>(this.apiContributions + '/accounts').pipe(map(res => res));
  }

  getMySubByType(personnelID: number, typeID: number) {
    return this.http.get<Contributions>(this.apiContributions + '/cid/' + personnelID + '/' + typeID).pipe(map(res => res));
  }

  saveSubs(data: Contributions) {
    return this.http.post<Contributions>(this.apiContributions, data).pipe(map(res => res));
  }

  editSubs(data: Contributions) {
    return this.http.put<Contributions>(this.apiContributions, data).pipe(map(res => res));
  }

  deleteSubs(id: number) {
    return this.http.delete<Contributions>(this.apiContributions + '/rem/' + id).pipe(map(res => res));
  }

  // Payments api
  getPayments() {
    return this.http.get<Payments[]>(this.apiPayments).pipe(map(res => res));
  }

  getMyPayments(personnelID) {
    return this.http.get<Payments[]>(this.apiPayments + '/uid/' + personnelID).pipe(map(res => res));
  }

  getMyPaymentByContribution(contribID: number) {
    return this.http.get<Payments[]>(this.apiPayments + '/cid/' + contribID).pipe(map(res => res));
  }

  savePayment(data: Payments) {
    return this.http.post<Payments>(this.apiPayments, data).pipe(map(res => res));
  }

  makePayment(data: Payments) {
    return this.http.post<Payments>(this.apiPayments + '/my', data).pipe(map(res => res));
  }

  editPayment(data: Payments) {
    return this.http.put<Payments>(this.apiPayments, data).pipe(map(res => res));
  }

  deletePayment(id: number) {
    return this.http.delete<Payments>(this.apiPayments + '/rem/' + id).pipe(map(res => res));
  }

  // Payments api
  getTransfer() {
    return this.http.get<TransferSubs[]>(this.apiTransfer).pipe(map(res => res));
  }

  saveTransfer(data: TransferSubs) {
    return this.http.post<TransferSubs>(this.apiTransfer, data).pipe(map(res => res));
  }

  editTransfer(data: TransferSubs) {
    return this.http.put<TransferSubs>(this.apiTransfer, data).pipe(map(res => res));
  }

  deleteTransfer(id: number) {
    return this.http.delete<Payments>(this.apiTransfer + '/rem/' + id).pipe(map(res => res));
  }
}
