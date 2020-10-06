import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {User} from '../../admin/users.model';
import {DataService} from '../../services/data.service';
import {UsersService} from '../../admin/users.service';
import {Personnel} from '../emplyees.model';
import {EmployeesService} from '../employees.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  dataLoaded = false;
  queryForm: FormGroup;
  user: User;
  personnel: Personnel;
  private loginUser: User;

  constructor(private _formBuilder: FormBuilder,
              private dataStore: DataService,
              private http: UsersService,
              private memberService: EmployeesService,
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
    this.personnel = null;
    this.http.getUserByName(this.queryForm.controls.fileNo.value, type).pipe(first()).subscribe(res => {
      this.user = res;
      this.getPersonnel();
    });
  }

  getPersonnel() {
    this.memberService.getUserPersonnel(this.user.id).pipe(first()).subscribe(res => this.personnel = res);
  }

  done(event: Personnel) {
    this.user = null;

    this.messageService.add({
      severity: 'success', summary: 'Update Success',
      detail: event.name + ' member data updated successfully'
    });
  }

  close() {
    this.user = null;
    this.personnel = null;
  }
}
