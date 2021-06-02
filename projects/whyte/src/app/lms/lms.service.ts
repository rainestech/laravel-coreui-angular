import {Injectable} from "@angular/core";
import {Endpoints} from "../endpoints";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class LmsService {
    private apiUsers = 'https://api.mytritek.co.uk/v1/users';
    private apiLocalUsers = Endpoints.mainUrl + Endpoints.adminApi + '/lms';
    private apiPing = 'https://api.mytritek.co.uk/v1/ping';

    constructor(private http: HttpClient) {
    }

    ping() {
        return this.http.get(this.apiPing).pipe(map(res => res));
    }

    getUsers() {
        return this.http.get<any[]>(this.apiUsers).pipe(map(res => res));
    }

    proxyUsers() {
        return this.http.get<any[]>(this.apiLocalUsers).pipe(map(res => res));
    }
}
