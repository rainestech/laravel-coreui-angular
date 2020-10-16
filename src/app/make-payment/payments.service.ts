import { Injectable } from '@angular/core';
import {Payment, PaymentCharge} from './payment.model';
import {Endpoints} from '../endpoints';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private api = Endpoints.mainUrl + Endpoints.appApi + '/banking';
  private apiCharges = this.api + '/charges';
  private apiPay = this.api + '/pay';

  constructor(private http: HttpClient) { }

  getCharges() {
    return this.http.get<PaymentCharge[]>(this.apiCharges).pipe(map(res => res));
  }

  editCharge(data: PaymentCharge) {
    return this.http.put<PaymentCharge>(this.apiCharges, data).pipe(map(res => res));
  }

  saveCharge(data: PaymentCharge) {
    return this.http.post<PaymentCharge>(this.apiCharges, data).pipe(map(res => res));
  }

  deleteCharge(id: number) {
    return this.http.delete<PaymentCharge>(this.apiCharges + '/rem/' + id).pipe(map(res => res));
  }

  postPayment(payment: Payment) {
    return this.http.post<Payment>(this.apiPay, payment).pipe(map(res => res));
  }
}
