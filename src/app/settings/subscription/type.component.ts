import {Component, OnInit} from '@angular/core';
import {ContributionType, cycles, getPeriodLabel} from '../../contributions/contributions.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {Cols, User} from '../../admin/users.model';
import {ContributionsService} from '../../contributions/contributions.service';
import {first} from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {
  view = 1;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: ContributionType[] = [];
  title: string = 'Add New Subscription Type';
  typeForm: FormGroup;
  submitted = false;
  periods = cycles;
  loginUser: User;
  curData: ContributionType;

  constructor(private formBuilder: FormBuilder,
              private dataStore: DataService,
              private http: ContributionsService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.typeForm.controls;
  }

  ngOnInit(): void {
    this.loginUser = this.dataStore.getUser();
    this.cols.push({field: 'name', header: 'Name'});
    this.cols.push({field: 'description', header: 'Description'});
    this.cols.push({field: 'optional', header: 'Type'});
    this.cols.push({field: 'fixed', header: 'Rate Type'});
    this.cols.push({field: 'noPerAnnum', header: 'Period'});
    this.cols.push({field: 'amount', header: 'Amount'});

    this.refresh();
  }

  edit(data: ContributionType) {
    this.submitted = false;
    if (!data) {
      data = new ContributionType();
    } else {
      this.curData = data;
      this.title = 'Edit ' + data.name + ' Contribution/Subscription';
    }
    this.typeForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      noPerYear: [data.noPerYear ? data.noPerYear : 0, Validators.required],
      minAmount: [data.minAmount, Validators.required],
      maxAmount: [data.maxAmount, Validators.required],
      description: [data.description, Validators.required],
      optional: [data.optional === undefined ? '' : +data.optional, Validators.required],
      fixed: [data.fixed === undefined ? '' : +data.optional, Validators.required],
    });
    this.view = 2;
  }

  refresh() {
    this.http.getTypes().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  getPeriodLabel(noPerAnum: number) {
    return getPeriodLabel(noPerAnum);
  }

  del(data) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + data.name + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteType(data.id).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Success',
              detail: data.name + ' Contribution type removed from Database!'
            });
          });
      },
      reject: () => {
        return;
      }
    });
  }

  close() {
    this.view = 1;
  }

  onSubmit() {
    this.typeForm.updateValueAndValidity();
    if (this.typeForm.invalid) {
      return;
    }

    const data = this.typeForm.value;

    if (this.curData?.id) {
      data.id = this.curData.id;
      this.put(data);
    } else {
      this.post(data);
    }
  }

  private put(data: ContributionType) {
    const oldDataSet = [...this.dataSet];
    this.http.editType(data).pipe(first()).subscribe(res => {
      oldDataSet[this.dataSet.indexOf(this.curData)] = res;
      this.dataSet = oldDataSet;
      this.view = 1;
      this.messageService.add({severity: 'success', summary: 'Update Success', detail: data.name + ' Updated!'});
    });
  }

  private post(data: ContributionType) {
    this.http.saveType(data).pipe(first()).subscribe(res => {
      this.dataSet.push(data);
      this.view = 1;
      this.messageService.add({severity: 'success', summary: 'Add Success', detail: data.name + ' Saved!'});
    });
  }
}
