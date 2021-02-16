import { Component, OnInit } from '@angular/core';
import {DataService} from "../service/data.service";
import {User} from "../admin/users.model";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    view = 1;
    loginUser: User;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
      this.loginUser = this.dataService.getUser();
      if (this.loginUser.companyName) {
          console.log(this.loginUser.companyName);
        this.view = 1;
      } else {
        this.view = 2;
      }
  }

}
