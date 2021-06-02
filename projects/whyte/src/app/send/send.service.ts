import {Injectable} from "@angular/core";
import {Endpoints} from "../endpoints";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class SendMailService {
    private api = Endpoints.mainUrl + Endpoints.apiUrl + '/emails';

    constructor(private http: HttpClient) {
    }

    getMails() {
        return this.http.get<any[]>(this.api).pipe(map(res => res));
    }

    saveEmail(data: any) {
        return this.http.post<any>(this.api, data).pipe(map(res => res));
    }

    editMail(data: any) {
        return this.http.put<any>(this.api, data).pipe(map(res => res));
    }

    deleteMail(data: any) {
        return this.http.delete(this.api + '/rem/' + data.id).pipe(map(res => res));
    }
}
