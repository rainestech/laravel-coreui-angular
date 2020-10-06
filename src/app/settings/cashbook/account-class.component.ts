import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {Cols, User} from '../../admin/users.model';
import {DataService} from '../../services/data.service';
import {CashbookService} from '../../cashbook/cashbook.service';
import {Category} from '../../banking/banking.model';

@Component({
  selector: 'app-account-class',
  templateUrl: './account-class.component.html',
  styleUrls: ['./account-class.component.scss']
})
export class AccountClassComponent implements OnInit {
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: Category[] = [];
  categoryForm: FormGroup;
  addEdit: BsModalRef;
  title = 'Add New Account Category';
  submitted = false;
  loginUser: User;
  private curCat: Category;
  private newCat: Category;

  constructor(private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private dataStore: DataService,
              private http: CashbookService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  get f() {
    return this.categoryForm.controls;
  }

  ngOnInit() {
    this.loginUser = this.dataStore.getUser();
    this.cols.push({field: 'name', header: 'Name'});
    this.cols.push({field: 'type', header: 'Type'});

    this.refresh();
  }

  edit(temp: TemplateRef<any>, data: Category) {
    if (!data) {
      this.categoryForm = this.formBuilder.group({
        name: ['', Validators.required],
        type: ['', Validators.required],
      });

      this.title = 'New Account Category';
    } else {
      this.categoryForm = this.formBuilder.group({
        id: [data.id, Validators.required],
        name: [data.name, Validators.required],
        type: [data.type, Validators.required],
      });

      this.title = 'Edit ' + data.name + ' Category';
      this.curCat = data;
    }
    this.addEdit = this.modalService.show(temp);
  }

  refresh() {
    this.http.getCategory().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  del(data: Category) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Account: ' + data.name + ' category?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteCategory(data).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({severity: 'success', summary: 'Delete Success', detail: data.name + ' Removed from Database!'});
          });
      },
      reject: () => {
        return;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.categoryForm.invalid) {
      return;
    } else {
      this.newCat = this.categoryForm.value;
      if (this.newCat.id) {
        this.put();
      } else {
        this.post();
      }
    }
  }

  private put() {
    const oldDataSet = [...this.dataSet];
    this.http.editCategory(this.newCat).pipe(first()).subscribe(
      data => {
        this.addEdit.hide();
        this.submitted = false;
        oldDataSet[this.dataSet.indexOf(this.curCat)] = data;
        this.dataSet = oldDataSet;
        this.messageService.add({severity: 'success', summary: 'Update Success', detail: this.newCat.name + ' Updated!'});
      });
  }

  private post() {
    this.http.saveCategory(this.newCat).pipe(first()).subscribe(res => {
      this.dataSet.push(res);
      this.messageService.add({severity: 'success', summary: 'Save Success', detail: this.newCat.name + ' Saved Successfully!'});
      this.addEdit.hide();
      this.submitted = false;
    });
  }
}
