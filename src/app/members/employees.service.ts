import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {NextOfKin, Occupation, Personnel, PersonnelAccount} from './emplyees.model';
import {map} from 'rxjs/operators';
import {Endpoints} from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private api = Endpoints.mainUrl + Endpoints.appApi;
  private apiPersonnel = this.api + '/personnel';
  private apiDashboard = this.api + '/dashboard';
  private apiPersonnelFile = this.apiPersonnel + '/file';
  private apiPersonnelFiles = this.apiPersonnel + '/files';
  private apiUsers = Endpoints.mainUrl + Endpoints.apiUrl + '/users';


  constructor(private http: HttpClient) {
  }

  // Personnel Api Calls
  getEmployees() {
    return this.http.get<Personnel[]>(this.apiPersonnel)
      .pipe(map(data => data));
  }

  getUserPersonnel(id: number) {
    return this.http.get<Personnel>(this.apiPersonnel + '/uid/' + id)
      .pipe(map(data => data));
  }

  saveEmployee(data: Personnel) {
    return this.http.post<Personnel>(this.apiPersonnel, data)
      .pipe(map(res => res));
  }

  saveEmpOcc(data: Occupation) {
    return this.http.post<Occupation>(this.apiPersonnel + '/occ', data)
      .pipe(map(res => res));
  }

  saveEmpNok(data: NextOfKin) {
    return this.http.post<NextOfKin>(this.apiPersonnel + '/nok', data)
      .pipe(map(res => res));
  }

  saveEmpBank(data: PersonnelAccount) {
    return this.http.post<PersonnelAccount>(this.apiPersonnel + '/acc', data)
      .pipe(map(res => res));
  }

  adminSaveEmployee(data: Personnel) {
    return this.http.post<Personnel>(this.apiPersonnel + '/admin', data)
      .pipe(map(res => res));
  }

  editEmployee(data: Personnel) {
    return this.http.put<Personnel>(this.apiPersonnel, data)
      .pipe(map(res => res));
  }

  adminEditEmployee(data: Personnel) {
    return this.http.put<Personnel>(this.apiPersonnel + '/admin', data)
      .pipe(map(res => res));
  }

  deleteEmployee(data: Personnel) {
    return this.http.delete<any>(this.apiPersonnel + '/' + data.id)
      .pipe(map(res => res));
  }

  uploadPassport(data: FormData, employee: Personnel) {
    return this.http.post<any>(this.apiPersonnel + '/file/passport/' + employee.id, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

        switch (event.type) {

          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            return {status: 'progress', message: progress};

          case HttpEventType.Response:
            return event.body;
          default:
            return `Unhandled event: ${JSON.stringify(event)}`;
        }
      })
    );
  }

  updateFile(data: FormData, id: number, personnelNo: number, fileType: string) {
    return this.http.post<any>(this.apiPersonnel + '/file/' + fileType + '/' + personnelNo + '/' + id, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

        switch (event.type) {

          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            return {status: 'progress', message: progress};

          case HttpEventType.Response:
            return event.body;
          default:
            return `Unhandled event: ${JSON.stringify(event)}`;
        }
      })
    );
  }

  findEmployee(fileNo: any) {
    return this.http.get<Personnel>(this.apiPersonnel + '/find/' + fileNo.fileNo)
      .pipe(map(res => res));
  }

  findByMcsNo(mcsNo: string) {
    return this.http.get<Personnel>(this.apiPersonnel + '/mcs/' + mcsNo)
      .pipe(map(res => res));
  }

  // getFiles(curPersonnel: Personnel) {
  //   return this.http.get<PersonnelFiles[]>(this.apiPersonnel + '/files/' + curPersonnel.id)
  //     .pipe(map(res => res));
  // }
  //
  // getFile(curPersonnel: Personnel, name: string) {
  //   return this.http.get<PersonnelFiles>(this.apiPersonnel + '/file/' + curPersonnel.id + '/' + name)
  //     .pipe(map(res => res));
  // }

  deletePassportFile(ins: number) {
    return this.http.delete<any>(this.apiPersonnel + '/del/passport/' + ins).pipe(map(res => res));
  }

  getEmployeeByFileNo(fileNo: string) {
    return this.http.get<Personnel>(this.apiPersonnel + '/number/' + fileNo).pipe(map(res => res));
  }


  searchByName(search: string) {
    return this.http.get<Personnel[]>(this.apiPersonnel + '/searchName/' + search).pipe(map(res => res));
  }

  getProfile() {
    return this.http.get<Personnel>(this.apiPersonnel + '/member').pipe(map(res => res));
  }

  // getPassport(id: number) {
  //   return this.http.get<PersonnelFiles>(this.apiPersonnelFile + '/' + id + '/passport').pipe(map(res => res));
  // }

  updatePersonnel(data: Personnel) {
    return this.http.put<Personnel>(this.apiPersonnel, data).pipe(map(res => res));
  }

  // getDashboard() {
  //   return this.http.get<DashboardRequest>(this.apiDashboard).pipe(map(res => res));
  // }
}
