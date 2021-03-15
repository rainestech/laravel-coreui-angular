import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Endpoints} from '../endpoints';
import {Documents} from "./docs.model";
import {FileStorage} from "../storage/storage.model";

@Injectable({
  providedIn: 'root'
})
export class DocService {
  private apiDoc = Endpoints.mainUrl + Endpoints.appApi + '/docs';
  private apiFile = Endpoints.mainUrl + Endpoints.appApi + '/docs/file';

  constructor(private http: HttpClient) {
  }

  getMyDocuments() {
    return this.http.get<Documents[]>(this.apiDoc)
      .pipe(map(res => res));
  }

  getUserDocs(uid: number) {
    return this.http.get<Documents[]>(this.apiDoc +  '/uid/' + uid)
      .pipe(map(res => res));
  }

  saveDoc(data: Documents) {
    return this.http.post<Documents>(this.apiDoc, data)
      .pipe(map(res => res));
  }

  updateDoc(data: Documents) {
    return this.http.put<Documents>(this.apiDoc, data)
      .pipe(map(res => res));
  }

  saveFile(data: FormData) {
    return this.http.post<FileStorage>(this.apiFile, data).pipe(map(res => res));
  }

  saveAllFile(data: FormData[]) {
    return this.http.post<FileStorage[]>(this.apiFile, data, {
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

  updateFile(data: FormData) {
    return this.http.put<FileStorage>(this.apiFile, data).pipe(map(res => res));
  }

  deleteDoc(data: number) {
    return this.http.delete(this.apiDoc + '/remove/' + data).pipe(map(res => res));
  }
}
