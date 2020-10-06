import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Personnel} from '../emplyees.model';
import {User} from '../../admin/users.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../admin/users.service';
import {EmployeesService} from '../employees.service';
import {first} from 'rxjs/operators';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-personnel-search',
  templateUrl: './query.user.component.html',
})
export class QueryUserComponent implements OnInit {
  personnel: Personnel;
  @Output() closeView = new EventEmitter<boolean>();
  @Output() data = new EventEmitter<Personnel>();
  @Input() user: User;
  @Input() filter: any[] = [];
  @Output() selOption = new EventEmitter<number>();
  queryForm: FormGroup;
  @Input() title: string;
  @Input() enableClose = false;
  @Input() filterTitle: string;

  constructor(private _formBuilder: FormBuilder,
              private dataStore: DataService,
              private http: UsersService,
              private memberService: EmployeesService) {
  }

  ngOnInit() {
    this.queryForm = this._formBuilder.group({
      fileNo: ['', Validators.required],
      filter: ['0']
    });

    this.dataStore.resetFilter.subscribe(value => {
      if (value) {
        this.close();
      }
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

  close() {
    this.user = null;
    this.personnel = null;
    this.data.emit(null);
    this.closeView.emit(true);
  }

  private getPersonnel() {
    this.memberService.getUserPersonnel(this.user.id).pipe(first()).subscribe(res => {
      this.personnel = res;
      this.data.emit(res);
      this.selOption.emit(this.queryForm.controls.filter.value);
    });
  }
}
