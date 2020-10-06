import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {Cols, User} from '../../admin/users.model';
import {CashbookService} from '../../cashbook/cashbook.service';
import {DataService} from '../../services/data.service';
import {AccountChart, Category, getRealParent} from '../../banking/banking.model';
import {getFormValidationErrors} from '../../contributions/contributions.model';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss']
})
export class AccountTypeComponent implements OnInit {
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: AccountChart[] = [];
  chartForm: FormGroup;
  addEdit: BsModalRef;
  title = 'New Account Chart';
  submitted = false;
  classifications: Category[] = [];
  loginUser: User;
  heads: AccountChart[] = [];
  mainHead = true;
  subHeads: AccountChart[] = [];
  subHead = false;
  view = 1;
  private curData: AccountChart;
  private selClass: Category;
  private newData: AccountChart;
  private selHead: AccountChart;
  private selSubHead: AccountChart;

  constructor(private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private http: CashbookService,
              private dataStore: DataService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.chartForm.controls;
  }

  ngOnInit() {
    this.getClass();
    this.loginUser = this.dataStore.getUser();
    this.cols.push({field: 'name', header: 'Head'});
    this.cols.push({field: 'category.name', header: 'Account Type'});
    // this.cols.push({ field: 'description', header: 'Description' });
    this.cols.push({field: 'parent', header: 'Parent'});
    this.cols.push({field: 'childCategories', header: 'Sub Category'});

    this.refresh();
  }

  edit(data: AccountChart) {
    // console.log(data);
    if (!data) {
      data = new AccountChart();
      this.title = 'New Account Head/Subhead';
    } else {
      this.title = 'Edit ' + data.name + ' Head/Subhead';
      this.curData = data;
      this.selClass = data.category;
      this.selHead = data.parent?.parent;
      this.selSubHead = data.parent;
      // this.children = this.dataSet.filter(p => p.parent !== null && p.parent.id === this.selParent.id);
      this.subHeads = this.dataSet.filter(p => p.parent !== null && p.parent.parent === null);
    }

    this.chartForm = this.formBuilder.group({
      description: [data.description, Validators.required],
      code: [data.code],
      name: [data.name, Validators.required],
      annualReset: [data.parent ? data.parent.annualReset : data.annualReset],
      head: [data.parent?.parent ? data.parent.parent.id : 0, Validators.required],
      subHead: [data.parent ? data.parent.id : 0, Validators.required],
      category: [data.category?.id, Validators.required],
      subHeadNo: [data.subHeadNo],
      headNo: [data.headNo],
    });

    this.formValueChanges();
    this.view = 2;
  }

  refresh() {
    this.http.getAccType().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  del(data: AccountChart) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete: ' + data.name + ' Head/Subhead?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteAccType(data).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Success',
              detail: data.name + ' Head/Subhead Removed from Database!'
            });
          });
      },
      reject: () => {
        return;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.chartForm.invalid) {
      getFormValidationErrors(this.chartForm);
      return;
    } else {
      this.newData = this.chartForm.value;
      this.newData.category = this.selClass;
      this.newData.parent = this.selHead ? this.selHead : this.selSubHead;
      if (this.selHead) {
        this.newData.annualReset = this.selHead.annualReset;
      }
      if (this.newData.parent) {
        this.newData.annualReset = this.newData.parent.annualReset;
      }
      if (this.curData?.id) {
        this.newData.id = this.curData.id;
        this.put();
      } else {
        this.post();
      }
    }
  }

  getChildren(data: string[]) {
    let res = '';
    data.forEach(d => {
      res = res + d + ', ';
    });
    return res.replace(/(^\s*,)|(,\s*$)/g, '');
  }

  close() {
    this.submitted = false;
    this.curData = null;
    this.view = 1;
  }

  private formValueChanges() {
    this.heads = this.dataSet.filter(p => p.parent === null);
    // this.children = this.dataSet.filter(p => p.parent !== null && p.parent.parent === null);

    this.chartForm.controls['category'].valueChanges.subscribe(value => {
      this.selClass = this.classifications.find(c => c.id === +value);
    });

    this.chartForm.controls['head'].valueChanges.subscribe(value => {
      if (+value === 0) {
        this.selHead = null;
        this.mainHead = true;
        this.f.annualReset.setValidators(Validators.required);
        this.f.subHead.clearValidators();
        this.f.subHeadNo.clearValidators();
      } else {
        this.selHead = this.heads.find(c => c.id === +value);
        this.f.headNo.clearValidators();
        this.f.category.setValue(this.selHead.category.id);
        this.f.annualReset.clearValidators();
        this.f.subHead.setValidators(Validators.required);
        this.subHeads = this.dataSet.filter(p => p.parent !== null && p.parent.id === this.selHead.id);
        this.mainHead = false;
      }

      this.f.subHead.updateValueAndValidity();
      this.f.subHeadNo.updateValueAndValidity();
      this.f.headNo.updateValueAndValidity();
      this.f.annualReset.updateValueAndValidity();
      this.f.category.updateValueAndValidity();
    });

    this.f.subHead.valueChanges.subscribe(value => {
      if (+value === 0) {
        this.subHead = false;
        this.f.annualReset.setValidators(Validators.required);
      } else {
        this.f.annualReset.clearValidators();
        this.selSubHead = this.subHeads.find(c => c.id === +value);
        this.subHead = true;
      }

      this.f.annualReset.updateValueAndValidity();
    });
  }

  private getClass() {
    this.http.getCategory().pipe().subscribe(res => {
      this.classifications = [...res];
    });
  }

  private put() {
    const oldDataSet = [...this.dataSet];
    this.http.editAccType(this.newData).pipe(first()).subscribe(
      data => {
        oldDataSet[this.dataSet.indexOf(this.curData)] = data;
        this.dataSet = oldDataSet;
        this.close();
        this.messageService.add({severity: 'success', summary: 'Update Success', detail: this.newData.name + ' Updated!'});
      });
  }

  private post() {
    this.http.saveAccType(this.newData).pipe(first()).subscribe(res => {
      this.dataSet.push(res);
      this.messageService.add({severity: 'success', summary: 'Save Success', detail: this.newData.name + ' Saved Successfully!'});
      this.close();
    });
  }

  getNameLabel() {
      this.chartForm.controls.subHead.updateValueAndValidity({onlySelf: true, emitEvent: false});
      this.chartForm.controls.head.updateValueAndValidity({onlySelf: true, emitEvent: false});
      if (+this.chartForm.controls.head.value === 0) {
        return 'Head Name';
      } else  if (+this.chartForm.controls.subHead.value === 0) {
        return 'Sub Head Name';
      }
    return 'Service Name';
  }
}
