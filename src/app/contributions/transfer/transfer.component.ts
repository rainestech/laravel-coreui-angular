import {Component, OnInit} from '@angular/core';
import {Cols, User} from '../../admin/users.model';
import {Contributions, TransferSubs} from '../contributions.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContributionsService} from '../contributions.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DataService} from '../../services/data.service';
import {first} from 'rxjs/operators';
import {Personnel} from '../../members/emplyees.model';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
    view = 1;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: TransferSubs[] = [];
  transferForm: FormGroup;
  accounts: Contributions[] = [];
  submitted = false;
  accountOpts: Contributions[] = [];
  submitControl = false;
  currEdit: TransferSubs;
  loginUser: User;
  private selFromSub: Contributions;
  private selToSub: Contributions;
  newTransfer: TransferSubs;
  private personnel: Personnel;
  get f() { return this.transferForm.controls; }

  constructor(private http: ContributionsService,
              private messageService: MessageService,
              private dataService: DataService,
              private formBuilder: FormBuilder,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    this.cols = [
      {header: 'Date', field: 'txDate'},
      {header: 'From', field: 'fromSub.type.name'},
      {header: 'To', field: 'toSub.type.name'},
      {header: 'Amount', field: 'amount'},
      {header: 'Remarks', field: 'remarks'},
    ];

    this.refresh();
  }

  refresh() {
    this.http.getTransfer().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded  = true;
    });
  }

  getContributions() {
    this.http.getMySubs(this.personnel.id).pipe(first()).subscribe(res => {
      this.accounts = res;
    });
  }

  new(data: TransferSubs = null) {
    this.submitControl = false;
    if (data === null) {
      this.transferForm = this.formBuilder.group({
        toSub: ['', Validators.required],
        fromSub: ['', Validators.required],
        txDate: ['', Validators.required],
        remarks: ['', Validators.required],
        amount: ['', [Validators.required, Validators.min(0.01)]],
      });
    } else {
      this.transferForm = this.formBuilder.group({
        id: [data.id, Validators.required],
        toSub: [data.toSub.id, Validators.required],
        fromSub: [data.fromSub.id, Validators.required],
        txDate: [new Date(data.txDate), Validators.required],
        description: [data.remarks, Validators.required],
        amount: [data.amount, [Validators.required, Validators.min(0.01)]],
      });

      this.selFromSub = data.fromSub;
      this.selToSub = data.toSub;
      this.currEdit = data;
    }

    this.formValueChanges();
    this.view = 2;
  }

  formValueChanges() {
    this.f.fromSub.valueChanges.subscribe(value => {
      this.accountOpts = this.accounts.filter(d => d.id !== +value);
      this.selFromSub = this.accounts.find(d => d.id === +value);
    });

    this.f.toSub.valueChanges.subscribe(value => {
      this.selToSub = this.accounts.find(d => d.id === +value);
    });
  }

  close() {
    this.view = 1;
  }

  submit() {
    this.submitted = true;
    if (this.transferForm.invalid) {
      return;
    }
    this.submitControl = true;
    this.newTransfer = this.transferForm.value;
    this.newTransfer.toSub = this.selToSub;
    this.newTransfer.fromSub = this.selFromSub;
    if (this.newTransfer.id) {
      this.put();
    } else {
      this.post();
    }
  }

  post() {
    this.http.saveTransfer(this.newTransfer).pipe(first()).subscribe(res => {
      this.dataSet.push(res);
      this.close();
      this.messageService.add({
        severity: 'success',
        summary: 'Transfer Success',
        detail: res.amount + ' Transferred from ' + res.fromSub.type.name + ' to ' + res.toSub.type.name + ' successful'
      });
    }, () => { this.submitControl = false; });
  }

  put() {
    this.http.editTransfer(this.newTransfer).pipe(first()).subscribe(res => {
      const oldData = this.dataSet;
      oldData[this.dataSet.indexOf(this.currEdit)] = res;
      this.dataSet = oldData;
      this.close();
      this.messageService.add({
        severity: 'success',
        summary: 'Transfer Edit Success',
        detail: res.amount + ' transferred from ' + res.fromSub.type.name + ' to ' + res.toSub.type.name + ' edit successful!'
      });
    }, () => { this.submitControl = false; });
  }

  deleteTransfer(data: TransferSubs) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected Transfer record?' +
          ' Note that this will also remove and undo the associated transactions',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteTransfer(data.id).pipe(first()).subscribe(
            () => {
              this.dataSet = this.dataSet.filter(f => f !== data);
              this.messageService.add({
                severity: 'success', summary: 'Delete Success',
                detail: 'Transfer record Removed from Database!'
              });
            });
      },
      reject: () => {
        return;
      }
    });
  }

  detailTransfer(data) {
    this.currEdit = data;
    this.view = 3;
  }

  getData(event: Personnel) {
    this.personnel = event;
    this.getContributions();
  }
}
