import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Endpoints} from '../endpoints';
import {MailTemplates, SmsTemplates} from '../admin/users.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private api = Endpoints.mainUrl + Endpoints.apiUrl + '/notifications';
  private apiMail = this.api + '/mail';
  private apiSms = this.api + '/sms';

  constructor(private http: HttpClient) {
  }

  getMailTemplates() {
    return this.http.get<MailTemplates[]>(this.apiMail).pipe(map(res => res));
  }

  saveMailTemplate(data: MailTemplates) {
    return this.http.post<MailTemplates>(this.apiMail, data).pipe(map(res => res));
  }

  updateMailTemplate(data: MailTemplates) {
    return this.http.put<MailTemplates>(this.apiMail, data).pipe(map(res => res));
  }

  deleteMailTemplate(tempID: number) {
    return this.http.delete<MailTemplates>(this.apiMail + '/rem/' + tempID).pipe(map(res => res));
  }

  getSmsTemplates() {
    return this.http.get<SmsTemplates[]>(this.apiSms).pipe(map(res => res));
  }

  saveSmsTemplate(data: SmsTemplates) {
    return this.http.post<SmsTemplates>(this.apiSms, data).pipe(map(res => res));
  }

  updateSmsTemplate(data: SmsTemplates) {
    return this.http.put<SmsTemplates>(this.apiSms, data).pipe(map(res => res));
  }

  deleteSmsTemplate(tempID: number) {
    return this.http.delete<SmsTemplates>(this.apiSms + '/rem/' + tempID).pipe(map(res => res));
  }
}
