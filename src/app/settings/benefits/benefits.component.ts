import {Component, OnInit} from '@angular/core';
import {BenefitType, getPeriodLabel, periods} from '../../contributions/contributions.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {ContributionsService} from '../../contributions/contributions.service';
import {Cols, User} from '../../admin/users.model';
import {first} from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent implements OnInit {
  view = 1;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: BenefitType[] = [];
  title = 'Add New Benefit Type';
  typeForm: FormGroup;
  submitted = false;
  periods = periods;
  loginUser: User;
  private curData: BenefitType;

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
    this.cols.push({field: 'url', header: 'Type'});
    this.cols.push({field: 'amount', header: 'Rate (Amount)'});
    this.cols.push({field: 'period', header: 'Period'});
    this.cols.push({field: 'optional', header: 'Optional'});

    this.refresh();
  }

  edit(data: BenefitType = null) {
    this.submitted = false;
    if (!data) {
      data = new BenefitType();
    } else {
      this.curData = data;
      this.title = 'Edit ' + data.name + ' Benefit Record';
    }
    this.typeForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      fixed: [data.fixed, Validators.required],
      period: [data.period, Validators.required],
      percentEarnings: [data.percentEarnings],
      amount: [data.amount],
      optional: [data.optional],
      url: [data.url],
    });

    if (data.fixed) {
      this.f.amount.setValidators([Validators.required]);
      this.f.percentEarnings.clearValidators();
    } else {
      this.f.percentEarnings.setValidators([Validators.required]);
      this.f.amount.clearValidators();
    }

    this.f.amount.updateValueAndValidity({onlySelf: true, emitEvent: false});
    this.f.percentEarnings.updateValueAndValidity({onlySelf: true, emitEvent: false});

    this.f.fixed.valueChanges.subscribe(value => {
      if (value === 'true') {
        this.f.amount.setValidators([Validators.required]);
        this.f.percentEarnings.clearValidators();
      } else {
        this.f.percentEarnings.setValidators([Validators.required]);
        this.f.amount.clearValidators();
      }

      this.f.amount.updateValueAndValidity({onlySelf: true, emitEvent: false});
      this.f.percentEarnings.updateValueAndValidity({onlySelf: true, emitEvent: false});
    });

    this.view = 2;
  }

  refresh() {
    this.dataLoaded = false;
    this.http.getBenefitTypes().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  getPeriodLabel(noPerYear: number) {
    return getPeriodLabel(noPerYear);
  }

  del(data) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + data.name + ' Benefit Tpe?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteBenefitType(data.id).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Success',
              detail: data.name + ' Benefit type removed from the System!'
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
    this.submitted = true;
    this.typeForm.updateValueAndValidity();
    if (this.typeForm.invalid) {
      return;
    }

    const data: BenefitType = this.typeForm.value;
    // @ts-ignore
    data.fixed = data.fixed === true ? true : data.fixed === 'true';

    // @ts-ignore
    data.optional = data.optional === true ? true : data.optional === 'true';

    if (this.curData?.id) {
      data.id = this.curData.id;
      this.put(data);
    } else {
      this.post(data);
    }
  }

  private put(data: BenefitType) {
    const oldDataSet = [...this.dataSet];
    this.http.editBenefitType(data).pipe(first()).subscribe(res => {
      oldDataSet[this.dataSet.indexOf(this.curData)] = res;
      this.dataSet = oldDataSet;
      this.view = 1;
      this.messageService.add({severity: 'success', summary: 'Update Success', detail: data.name + ' Updated!'});
    });
  }

  private post(data: BenefitType) {
    this.http.saveBenefitType(data).pipe(first()).subscribe(res => {
      this.dataSet.push(data);
      this.view = 1;
      this.messageService.add({severity: 'success', summary: 'Add Success', detail: data.name + ' Saved!'});
    });
  }
}
