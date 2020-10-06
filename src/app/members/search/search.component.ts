import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BsModalService} from 'ngx-bootstrap/modal';
import {EmployeesService} from '../employees.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Personnel} from '../emplyees.model';
import {first} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {SettingsService} from '../../settings/settings.service';

declare global {
  interface Window {
    onePageCanvas: any;
  }
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  queryForm: FormGroup;
  dataLoaded = false;
  cols: ({ field: string; header: string })[];
  dataSet: Personnel[] = [];
  view = 1;
  empReport: Personnel;
  imageSrc: any[] = [];


  constructor(private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private http: EmployeesService,
              private settingsService: SettingsService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {

    this.cols = [
      {field: 'name', header: 'Name.'},
      {field: 'joinDate', header: 'M. Date'},
      {field: 'lgas.states.name', header: 'State'},
      {field: 'occupation.name', header: 'Employer'},
      {field: 'occupation.rank', header: 'Rank'},
      {field: 'nok.name', header: 'Next of Kin'},
    ];

    this.refresh();
  }

  refresh() {
    this.http.getEmployees().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  closeReport() {
    this.view = 1;
  }

  print() {
    window.print();
  }

  viewDetails(data: Personnel) {
    console.log(data);
  }
}
