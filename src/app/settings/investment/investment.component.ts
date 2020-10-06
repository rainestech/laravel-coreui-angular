import {Component, OnInit} from '@angular/core';
import {InvestmentType} from '../../contributions/contributions.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {ContributionsService} from '../../contributions/contributions.service';
import {Cols, User} from '../../admin/users.model';
import {first} from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss']
})
export class InvestmentComponent implements OnInit {
  view = 1;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: InvestmentType[] = [];
  title = 'Add New Investment';
  typeForm: FormGroup;
  submitted = false;
  curData: InvestmentType;
  private loginUser: User;

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
    this.cols.push({field: 'amount', header: 'I. Amount'});
    this.cols.push({field: 'totalUnits', header: 'T. Units'});
    this.cols.push({field: 'initPrice', header: 'Unit Price'});
    this.cols.push({field: 'availableUnits', header: 'Available'});
    this.cols.push({field: 'maturityDate', header: 'Maturity'});

    this.refresh();
  }

  edit(data: InvestmentType) {
    if (!data) {
      data = new InvestmentType();
    } else {
      this.curData = data;
      this.title = 'Edit ' + data.name + ' Investment Record';
    }
    this.typeForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      unitPrice: [data.unitPrice, Validators.required],
      maturityDate: [data.maturityDate, Validators.required],
      totalUnits: [data.totalUnits, Validators.required],
      amount: [data.amount, Validators.required],
      url: [data.url],
    });

    this.view = 2;
  }

  refresh() {
    this.dataLoaded = false;
    this.http.getInvestmentTypes().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  del(data) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + data.name + ' Investment?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteInvestmentType(data.id).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Success',
              detail: data.name + ' Investment Record removed from the System!'
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

    const data: InvestmentType = this.typeForm.value;
    if (this.curData?.id) {
      data.id = this.curData.id;
      this.put(data);
    } else {
      data.availableUnits = data.totalUnits;
      data.initPrice = data.unitPrice;
      this.post(data);
    }
  }

  private put(data: InvestmentType) {
    const oldDataSet = [...this.dataSet];
    this.http.editInvestmentType(data).pipe(first()).subscribe(res => {
      oldDataSet[this.dataSet.indexOf(this.curData)] = res;
      this.dataSet = oldDataSet;
      this.view = 1;
      this.messageService.add({severity: 'success', summary: 'Update Success', detail: data.name + ' Updated!'});
    });
  }

  private post(data: InvestmentType) {
    this.http.saveInvestmentType(data).pipe(first()).subscribe(res => {
      this.dataSet.push(data);
      this.view = 1;
      this.messageService.add({severity: 'success', summary: 'Add Success', detail: data.name + ' Saved!'});
    });
  }
}
