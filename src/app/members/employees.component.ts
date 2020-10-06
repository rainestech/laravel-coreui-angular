import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Personnel} from './emplyees.model';
import {MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {UsersService} from '../admin/users.service';
import {DataService} from '../services/data.service';
import {User} from '../admin/users.model';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  dataLoaded = false;
  queryForm: FormGroup;
  user: User;
  private loginUser: User;

  constructor(private _formBuilder: FormBuilder,
              private dataStore: DataService,
              private http: UsersService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.loginUser = this.dataStore.getUser();
    this.queryForm = this._formBuilder.group({
      fileNo: ['', Validators.required]
    });
  }

  searchByName(type: string) {
    this.user = null;
    this.http.getUserByName(this.queryForm.controls.fileNo.value, type).pipe(first()).subscribe(res => {
      this.user = res;
    });
  }

  done(event: Personnel) {
    this.user = null;

    this.messageService.add({
      severity: 'success', summary: 'Save Success',
      detail: event.name + ' member added successfully'
    });
  }

  close() {
    this.user = null;
  }
}
