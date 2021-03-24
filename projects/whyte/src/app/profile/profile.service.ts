import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Endpoints} from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiProfile = Endpoints.mainUrl + Endpoints.apiUrl + '/profile';
  private apiPassport = this.apiProfile + '/passport';
  private apiLogo = this.apiProfile + '/passport';

  constructor(private http: HttpClient) {
  }

  getMyProfile() {
    return this.http.get<any>(this.apiProfile).pipe(map(res => res));
  }

  getSkillSet() {
    return this.http.get<any[]>(this.apiProfile + '/skillset').pipe(map(res => res));
  }

  getRecruiterByUserId(uid: number) {
    return this.http.get<any>(this.apiProfile + '/rid/' + uid).pipe(map(res => res));
  }

  getCandidateByUserId(uid: number) {
    return this.http.get<any>(this.apiProfile + '/cid/' + uid).pipe(map(res => res));
  }

  getCandidates() {
    return this.http.get<any[]>(this.apiProfile + '/candidates').pipe(map(res => res));
  }

  getRecruiters() {
    return this.http.get<any>(this.apiProfile + '/recruiters').pipe(map(res => res));
  }

  saveRecruiters(data: any) {
    return this.http.post<any>(this.apiProfile + '/recruiters', data).pipe(map(res => res));
  }

  editRecruiters(data: any) {
    return this.http.put<any>(this.apiProfile + '/recruiters', data).pipe(map(res => res));
  }

  saveCandidates(data: any) {
    return this.http.post<any>(this.apiProfile + '/candidates', data).pipe(map(res => res));
  }

  deleteRecruiters(data: number) {
    return this.http.delete<any>(this.apiProfile + '/recruiter/remove/' + data).pipe(map(res => res));
  }

  deleteCandidates(data: number) {
    return this.http.delete<any>(this.apiProfile + '/candidate/remove/' + data).pipe(map(res => res));
  }

  editCandidates(data: any) {
    return this.http.put<any>(this.apiProfile + '/candidates', data).pipe(map(res => res));
  }

  verifyRecruiter(data: number) {
    return this.http.get<any>(this.apiProfile +'/recruiter/verify/' + data).pipe(map(res => res));
  }
}
