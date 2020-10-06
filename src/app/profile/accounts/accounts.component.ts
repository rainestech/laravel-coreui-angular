import {Component, OnInit} from '@angular/core';
import {Personnel} from '../../members/emplyees.model';
import {first} from 'rxjs/operators';
import {DataService} from '../../services/data.service';
import {EmployeesService} from '../../members/employees.service';
import {User} from '../../admin/users.model';
import {Contributions, Payments} from '../../contributions/contributions.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  dataLoaded = false;
  personnel: Personnel;
  view = 1;
  loginUser: User;
  contributions: Contributions[];
  payments: Payments[];
  selSub: Contributions;

  constructor(private dataStore: DataService, private http: EmployeesService) {
  }

  ngOnInit(): void {
    this.loginUser = this.dataStore.getUser();
    this.http.getUserPersonnel(this.loginUser.id).pipe(first()).subscribe(res => {
      this.personnel = res;
      this.dataLoaded = true;
    });
  }

  curContributions(event: Contributions[]) {
    this.contributions = event;
  }

  selContribution(event: Contributions) {
    this.selSub = event;
    this.view = 2;
  }

  selDue(event: Contributions) {

  }

  close() {
    this.payments = null;
    this.view = 1;
  }
}
