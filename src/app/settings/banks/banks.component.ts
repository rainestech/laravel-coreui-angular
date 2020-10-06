import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {SettingsService} from '../settings.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {Banks} from '../../admin/users.model';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {

  dataLoaded = false;
  cols: ({ field: string; header: string })[];
  dataSet: Banks[] = [];
  bankForm: FormGroup;
  addEdit: BsModalRef;
  submitted = false;
  private newBank: Banks;

  constructor(private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private http: SettingsService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.bankForm.controls;
  }

  ngOnInit() {
    this.cols = [
      {field: 'name', header: 'Bank Name'},
      {field: 'postalAddress', header: 'Bank Address'},
      {field: 'phoneNo', header: 'Phone No.'},
      {field: 'email', header: 'Email'},
      {field: 'website', header: 'Website'},
    ];

    this.bankForm = this.formBuilder.group({
      name: ['', Validators.required],
      postalAddress: ['', Validators.required],
      phoneNo: ['', Validators.required],
      email: ['', Validators.required],
      website: ['', Validators.required],
    });

    this.refresh();
  }

  addBank(addTemp: TemplateRef<any>) {
    this.submitted = false;
    this.bankForm.reset();
    this.addEdit = this.modalService.show(addTemp);
  }

  refresh() {
    this.http.getBank().pipe(first()).subscribe(res => {
      this.dataSet = res;
      this.dataLoaded = true;
    });
  }

  cellEdit(data: Banks) {
    this.newBank = data;
    this.put();
  }

  delBank(data: Banks) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + data.name + ' Bank record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteBank(data).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success', summary: 'Delete Success',
              detail: data.name + ' Removed from Database!'
            });
          },
          () => {
            this.messageService.add({severity: 'error', summary: 'Server Error', detail: 'Server Error Occurred, Pls contact Admin!'});
          }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.bankForm.invalid) {
      return;
    } else {
      this.newBank = this.bankForm.value;
      if (this.newBank.id) {
        this.put();
      } else {
        this.post();
      }
    }
  }

  private put() {
    this.http.editBank(this.newBank).pipe(first()).subscribe(
      data => {
        this.messageService.add({
          severity: 'success', summary: 'Update Success',
          detail: data.name + ' Updated!'
        });
      },
      () => {
        this.messageService.add({severity: 'error', summary: 'Server Error', detail: 'Server Error Occurred, Pls contact Admin!'});
      }
    );
  }

  private post() {
    this.http.saveBank(this.newBank).pipe(first()).subscribe(
      data => {
        this.dataSet.push(data);
        this.addEdit.hide();
        this.messageService.add({severity: 'success', summary: 'Add Success', detail: data.name + ' Saved!'});
        // this.resetValues();
      },
      () => {
        this.messageService.add({severity: 'error', summary: 'Server Error', detail: 'Server Error Occurred, Pls contact Admin!'});
      }
    );
  }

}
