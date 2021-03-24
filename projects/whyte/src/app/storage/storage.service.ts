import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {FileStorage} from './storage.model';
import {Endpoints} from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private api = Endpoints.mainUrl + Endpoints.storageApi;

  constructor(private http: HttpClient) {
  }

  saveFile(data: FormData) {
    return this.http.post<FileStorage>(this.api, data).pipe(map(res => res));
  }

  saveAllFile(data: FormData[]) {
    return this.http.post<FileStorage[]>(this.api, data, {
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
    return this.http.put<FileStorage>(this.api, data).pipe(map(res => res));
  }

  deleteFile(data: number) {
    return this.http.delete<FileStorage>(this.api + '/rem/' + data).pipe(map(res => res));
  }


}
