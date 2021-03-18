import { Component, OnInit } from '@angular/core';
import {SearchService} from "../search/search.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {
  dataLoaded = false;
  page: any;
  token: any;


  constructor(private http: SearchService) { }

  ngOnInit(): void {
    this.http.getToken().pipe(first()).subscribe(res => {
      this.token = res;
      if (this.page)
        this.dataLoaded = true;
    });

    this.http.getTokenPage().pipe(first()).subscribe(res => {
      this.page = res;
      if (this.token) {
        this.dataLoaded = true;
      }
    });
  }

}
