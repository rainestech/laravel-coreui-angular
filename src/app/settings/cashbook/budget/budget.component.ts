import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {Cols, getYears, User} from '../../../admin/users.model';
import {AccountChart, Budget} from '../../../banking/banking.model';
import {DataService} from '../../../services/data.service';
import {CashbookService} from '../../../cashbook/cashbook.service';

@Component({
  selector: 'app-account-class',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: Budget[] = [];
  submitted = false;
  loginUser: User;
  view = 1;
  filterForm: FormGroup;
  budgetForm: FormGroup;
  submitControl = false;
  curBudget: Budget;
  private selAccountChart: AccountChart;
  private newBudget: Budget;
  accountCharts: AccountChart[] = [];
  category: AccountChart[] = [];
  chartOpts: AccountChart[];
  year: number;
  years = getYears();
  title = 'Budget New Item';
  private selHead: AccountChart;

  constructor(private formBuilder: FormBuilder,
              private dataStore: DataService,
              private http: CashbookService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.budgetForm.controls;
  }

  ngOnInit() {
    this.loginUser = this.dataStore.getUser();
    this.cols = [
      {field: 'accountChart.name', header: 'Sub Head'},
      {field: 'year', header: 'Year'},
      {field: 'proposed', header: 'Proposed'},
      {field: 'approved', header: 'Approved'},
      {field: 'active', header: 'Active'},
    ];

    this.http.getAccType().pipe(first()).subscribe(res => {
      this.accountCharts = res;
      this.category = res.filter(p => p.parent !== null && p.parent.parent === null);
    });

    this.filterForm = this.formBuilder.group({
      year: ['']
    });

    this.filterValueChanges();
    this.refresh();
  }

  refresh(year: number = null) {
    if (year) {
      this.http.getBudgetYear(year).pipe(first()).subscribe(res => {
        this.dataSet = [...res];
        this.dataLoaded = true;
      });
    } else {
      this.http.getCurrentYearBudget().pipe(first()).subscribe(res => {
        this.dataSet = [...res];
        this.dataLoaded = true;
      });
    }
  }

  edit(data: Budget = null) {
    if (!data) {
      data = new Budget();
    } else {
      this.curBudget = data;
    }
    this.submitControl = false;
    this.budgetForm = this.formBuilder.group({
      category: [data.accountChart?.parent.id, Validators.required],
      accountChart: [data.accountChart?.id, Validators.required],
      year: [data.year, Validators.required],
      remarks: [data.remarks],
      proposed: [data.proposed, Validators.required],
      proposedYr1: [data.proposedYr1],
      proposedYr2: [data.proposedYr2],
      actualYr1: [data.actualYr1],
      actualYr2: [data.actualYr2],
    });

    this.selAccountChart = data.accountChart;
    this.formValueChanges();
    this.view = 2;
  }

  delete(data: Budget) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + data.accountChart.name + ' Budget record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteBudget(data.id).pipe(first()).subscribe(
            () => {
              this.dataSet = this.dataSet.filter(f => f !== data);
              this.messageService.add({
                severity: 'success', summary: 'Delete Success',
                detail: data.accountChart.name + ' Budget Removed!'
              });
            });
      },
      reject: () => {
        return;
      }
    });
  }

  submit() {
    this.submitted = true;
    if (this.budgetForm.invalid) {
      return;
    }
    this.submitControl = true;
    this.newBudget = this.budgetForm.value;
    this.newBudget.accountChart = this.selAccountChart;
    this.newBudget.actual = 0;
    if (this.curBudget) {
      this.newBudget.id = this.curBudget.id;
      this.curBudget = null;
      this.put();
    } else {
      this.post();
    }
  }

  private formValueChanges() {
    // this.dataSet.forEach(d => {
    //   // if (d.items.category)
    //   this.items = this.items.filter(i => i.id !== d.items.id);
    // });

    this.budgetForm.controls.category.valueChanges.subscribe(value => {
      this.selHead = this.accountCharts.find(i => i.id === +value);
      this.chartOpts = this.accountCharts.filter(i => i.parent && i.parent.id === +value);
      if (this.chartOpts.length < 1) {
        this.chartOpts.push(this.selHead);
      }
    });

    this.budgetForm.controls.accountChart.valueChanges.subscribe(value => {
      this.selAccountChart = this.accountCharts.find(i => i.id === +value);
    });

    this.budgetForm.controls.year.valueChanges.subscribe(value => this.year = value);
  }

  private put() {
    this.http.editBudget(this.newBudget).pipe(first()).subscribe(res => {
      const oldData = this.dataSet;
      oldData[this.dataSet.indexOf(this.curBudget)] = res;
      this.dataSet = oldData;
      this.view = 1;
      this.messageService.add({
        severity: 'success', summary: 'Update Successful!',
        detail: res.accountChart.name + ' Budget Updated successfully!'
      });
    });
  }

  private post() {
    this.http.saveBudget(this.newBudget).pipe(first()).subscribe(res => {
      this.dataSet = [...this.dataSet, res];
      this.view = 1;
      this.messageService.add({
        severity: 'success', summary: 'Budget Successful!',
        detail: res.accountChart.name + ' Budgeted successfully!'
      });
    });
  }

  private filterValueChanges() {
    this.filterForm.controls['year'].valueChanges.subscribe(value => {
      this.refresh(+value);
      this.year = +value;
      // this.items = this.allItems;
    });
  }

  report(number: number) {
    
  }

  getYear(year: any) {
    
  }

  close() {
    this.view = 1;
  }

  getParent(item: AccountChart) {
    if (item.parent?.parent) {
      return item.parent.parent.name + ' - ' + item.parent.name;
    } else if (item.parent) {
      return item.parent.name;
    } else {
      return '';
    }
  }
}
