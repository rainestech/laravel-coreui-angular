import {Component, OnInit, TemplateRef} from '@angular/core';
import {CorrespondenceType} from '../settings.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {SettingsService} from '../settings.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-correspondence',
  templateUrl: './correspondence.component.html',
  styleUrls: ['./correspondence.component.scss']
})
export class CorrespondenceComponent implements OnInit {

  dataLoaded = false;
  cols: ({ field: string; header: string })[];
  dataSet: CorrespondenceType[] = [];
  unionForm: FormGroup;
  addEdit: BsModalRef;
  submitted = false;
  private newCorr: CorrespondenceType;

  constructor(private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private http: SettingsService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.unionForm.controls;
  }

  ngOnInit() {
    this.cols = [
      {field: 'type', header: 'Correspondence Type'},
    ];

    this.unionForm = this.formBuilder.group({
      type: ['', Validators.required],
    });

    this.refresh();
  }

  addCorr(addTemp: TemplateRef<any>) {
    this.submitted = false;
    this.unionForm.reset();
    this.addEdit = this.modalService.show(addTemp);
  }

  refresh() {
    this.http.getCorrespondence().pipe(first()).subscribe(res => {
      this.dataSet = res;
      this.dataLoaded = true;
    });
  }

  cellEdit(data: CorrespondenceType) {
    this.newCorr = data;
    this.put();
  }

  delCorr(data: CorrespondenceType) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + data.type + ' Correspondence subscription record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteCorrespondence(data).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({
              severity: 'success', summary: 'Delete Success',
              detail: data.type + ' Removed from Database!'
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
    if (this.unionForm.invalid) {
      return;
    } else {
      this.newCorr = this.unionForm.value;
      if (this.newCorr.id) {
        this.put();
      } else {
        this.post();
      }
    }
  }

  private put() {
    this.http.editCorrespondence(this.newCorr).pipe(first()).subscribe(
      data => {
        this.messageService.add({
          severity: 'success', summary: 'Update Success',
          detail: data.type + ' Updated!'
        });
      },
      () => {
        this.messageService.add({severity: 'error', summary: 'Server Error', detail: 'Server Error Occurred, Pls contact Admin!'});
      }
    );
  }

  private post() {
    this.http.saveCorrespondence(this.newCorr).pipe(first()).subscribe(
      data => {
        this.dataSet.push(data);
        this.addEdit.hide();
        this.messageService.add({severity: 'success', summary: 'Add Success', detail: data.type + ' Saved!'});
        // this.resetValues();
      },
      () => {
        this.messageService.add({severity: 'error', summary: 'Server Error', detail: 'Server Error Occurred, Pls contact Admin!'});
      }
    );
  }
}
