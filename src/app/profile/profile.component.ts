import {Component, OnInit} from '@angular/core';
import {EmployeesService} from '../members/employees.service';
import {DataService} from '../services/data.service';
import {User} from '../admin/users.model';
import {first} from 'rxjs/operators';
import {Personnel} from '../members/emplyees.model';

@Component({
  selector: 'app-personnel-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  personnel: Personnel;
  view = 1;
  dataLoaded = false;
  private loginUser: User;

  constructor(private http: EmployeesService, private dataStore: DataService) {
  }

  ngOnInit(): void {
    this.loginUser = this.dataStore.getUser();
    this.http.getUserPersonnel(this.loginUser.id).pipe(first()).subscribe(res => {
      this.personnel = res;
      this.dataLoaded = true;
    }, () => {
      console.log('error profile');
      this.view = 2;
      this.dataLoaded = true;
    });
  }

  close() {
    if (!this.personnel) {
      return;
    }
    this.view = 1;
  }

  accountProfile() {
    this.view = 3;
  }

  print() {
    window.print();
  }

  edit() {
    this.view = 2;
  }

  done($event: Personnel) {
    this.view = 1;
  }

  getEditTitle() {
    if (this.personnel) {
      return this.personnel.name + ' Update Record Details';
    }

    return 'Complete Your Membership Form';
  }

  getTitle() {
    if (!this.personnel) {
      this.dataLoaded = false;
      this.view = 2;
      this.dataLoaded = true;
      return;
    }
    if (this.view === 1) {
      return this.personnel.name + ' Full Data Report';
    } else if (this.view === 3) {
      return this.personnel.name + ' Application Account Profile'
    }
  }
}
