import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {Cols, User} from '../../admin/users.model';
import {first} from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {PaymentCharge} from '../../make-payment/payment.model';
import {PaymentsService} from '../../make-payment/payments.service';

@Component({
  selector: 'app-settings-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss']
})
export class ChargesComponent implements OnInit {
  view = 1;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: PaymentCharge[] = [];
  title = 'Add New Payment Charge';
  typeForm: FormGroup;
  submitted = false;
  loginUser: User;
  private curData: PaymentCharge;

  constructor(private formBuilder: FormBuilder,
              private dataStore: DataService,
              private http: PaymentsService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.typeForm.controls;
  }

  ngOnInit(): void {
    this.loginUser = this.dataStore.getUser();
    this.cols.push({field: 'name', header: 'Name'});
    this.cols.push({field: 'fixed', header: 'Type'});
    this.cols.push({field: 'optional', header: 'Optional'});
    this.cols.push({field: 'amount', header: 'Rate (Amount)'});

    this.refresh();
  }

  edit(data: PaymentCharge = null) {
    this.submitted = false;
    if (!data) {
      data = new PaymentCharge();
      this.curData = null;
    } else {
      this.curData = data;
      this.title = 'Edit ' + data.name + ' Payment Charge Record';
    }
    this.typeForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      fixed: [data.fixed, Validators.required],
      amount: [data.amount],
      optional: [data.optional],
    });

    this.view = 2;
  }

  refresh() {
    this.dataLoaded = false;
    this.http.getCharges().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  del(data) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + data.name + ' Benefit Tpe?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteCharge(data.id).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Success',
              detail: data.name + ' Payment Charge record removed from the System!'
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

    const data: PaymentCharge = this.typeForm.value;
    // @ts-ignore
    data.fixed = data.fixed === true ? true : data.fixed === 'true';

    // @ts-ignore
    data.optional = data.optional === true ? true : data.optional === 'true';

    if (this.curData) {
      data.id = this.curData.id;
      this.put(data);
    } else {
      this.post(data);
    }
  }

  private put(data: PaymentCharge) {
    const oldDataSet = [...this.dataSet];
    this.http.editCharge(data).pipe(first()).subscribe(res => {
      oldDataSet[this.dataSet.indexOf(this.curData)] = res;
      this.dataSet = oldDataSet;
      this.view = 1;
      this.messageService.add({severity: 'success', summary: 'Update Success', detail: data.name + ' Updated!'});
    });
  }

  private post(data: PaymentCharge) {
    this.http.saveCharge(data).pipe(first()).subscribe(res => {
      this.dataSet.push(data);
      this.view = 1;
      this.messageService.add({severity: 'success', summary: 'Add Success', detail: data.name + ' Saved!'});
    });
  }
}
