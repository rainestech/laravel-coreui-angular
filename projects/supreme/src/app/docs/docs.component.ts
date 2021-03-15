import {Component, Input, OnInit} from '@angular/core';
import {DocService} from "./docs.service";
import {DataService} from "../service/data.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {User} from "../admin/users.model";
import {first} from "rxjs/operators";
import {Documents} from "./docs.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FileProperties, FileStorage, fileStorageToFormData, readFile} from "../admin/file.reader";
import {Endpoints} from "../endpoints";

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  view = 1;
  dataLoaded = false;
  loginUser: User;
  docs: Documents[] = [];
  title = 'Add New Document';
  submitted = false;
  docForm: FormGroup;
  private maxSize = 10000000;
  private curFile: FileStorage;
  uploadError: string;
  selFileType: string;
  private curDoc: Documents;
  private fileUploaded = false;
  get f() { return this.docForm.controls; }
  fileType: string[] = ['image', 'doc', 'docx', 'xls', 'xlsx', 'pdf'];
  private pendingUpload: FileProperties[] = [];
  private token: string;


  constructor(private http: DocService,
              private dataService: DataService,
              private formBuilder: FormBuilder,
              private messageService: MessageService,
              private confirmService: ConfirmationService) { }

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    this.token = this.dataService.getToken();
    this.refresh();
  }

  refresh() {
    this.http.getMyDocuments().pipe(first()).subscribe(res => {
      this.docs = res;
      this.dataLoaded = true;
    })
  }

  togglePrivate(doc: Documents) {

  }

  editDoc(doc: Documents) {
    this.docForm = this.formBuilder.group({
      name: [doc?.name, Validators.required],
      description: [doc?.description, Validators.required],
      private: [false, Validators.required],
    });

    if (doc) {
      this.curDoc = doc;
      this.curFile = doc.file;
      this.selFileType = doc.file.fileType;
      this.fileUploaded = true;
    } else {
      this.curDoc = null;
      this.curFile = null;
      this.selFileType = null;
      this.fileUploaded = false;
    }

    this.view = 2;
  }

  deleteDoc(doc: Documents) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete from platform?',
      header: 'Delete Document',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.docs = this.docs.filter(m => m.id !== doc.id);
        this.http.deleteDoc(doc.id).pipe(first()).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Remove Success', detail: 'Document Deleted!'
              });
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  private validateFile(file: File): boolean {
      if (file.type.toLowerCase() === 'image/png'
          || file.type.toLowerCase() === 'image/jpg'
          || file.type.toLowerCase() === 'image/jpeg') {
        return this.validateFileSize(file);
      } else if (file.name.toLowerCase().includes('pdf')) {
        return this.validateFileSize(file);
      } else if (file.name.toLowerCase().includes('doc')) {
        return this.validateFileSize(file);
      } else if (file.name.toLowerCase().includes('xls')) {
        return this.validateFileSize(file);
      }

      this.messageService.add({
        severity: 'error',
        summary: 'File Format Not Supported'
      });
      return false;
    }

  private validateFileSize(file: File): boolean {
    this.selFileType = file.type.toLowerCase();
    if (file.size > this.maxSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'File must not be larger than ' + (this.maxSize / 1000).toFixed(0) + ' kb'
      });
      this.selFileType = null;

      return false;
    }

    return true;
  }

  readURL(event: any, fileType: string) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (!this.validateFile(file)) {
        return;
      }

      this.uploadError = null;
      readFile(file).then(e => {
        if (e.name) {
          this.pendingUpload = [];
          if (this.curFile) {
            this.curFile.link = null;
          }
          this.pendingUpload = [...this.pendingUpload, e];
          this.fileUploaded = false;
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'An error occurred loading your file, please try again!'
        });
      });
    }
  }

  passportUpload() {
    let data = this.curFile;
    if (!data) {
      data = new FileStorage();
      data.objID = 0;
      data.tag = 'documents';
    }

    const formData = fileStorageToFormData(this.pendingUpload[0], data);
    this.http.saveFile(formData).pipe(first()).subscribe(
        res => {
          this.curFile = res;
          this.fileUploaded = true;
          this.pendingUpload = [];
          const data: Documents = this.docForm.value;
          data.file = res;
          data.private = false;

          if (this.curDoc) {
            this.curDoc = {...this.curDoc, ...data};
            this.updateDoc();
          } else {
            this.curDoc = data;
            this.saveDoc();
          }
        });
  }

  saveDoc() {
    this.http.saveDoc(this.curDoc).pipe(first()).subscribe(doc => {
      this.messageService.add({
        severity: 'success', summary: 'Document Saved'
      });

      this.docs = [...this.docs, doc];
      this.view = 1;
    });
  }

  updateDoc() {
    this.http.updateDoc(this.curDoc).pipe(first()).subscribe(doc => {
      this.messageService.add({
        severity: 'success', summary: 'Document Updated'
      });

      this.docs[this.docs.indexOf(this.docs.find(d => d.id === this.curDoc.id))] = doc;
      this.view = 1;
    });
  }

  submitDoc() {
    this.docForm.updateValueAndValidity();
    if ((this.pendingUpload.length < 1 && !this.curFile || this.docForm.invalid)) {
      this.messageService.add({
        severity: 'error', summary: 'Please complete the document form!'
      });
      return;
    }

    if (this.fileUploaded && this.curDoc) {
      const data: Documents = this.docForm.value;

      data.private = false;
      this.curDoc = {...this.curDoc, ...data};
      this.updateDoc();
    } else {
      this.passportUpload();
    }
  }

  download(doc: Documents) {
    // const data = Endpoints.mainUrl + '/api/v1/docs/dl/' + doc.file.link + '?token=' + this.token;
    return window.open(Endpoints.mainUrl + '/api/v1/docs/dl/' + doc.file.link + '?token=' + encodeURIComponent(this.token),
        '_blank');
  }
}
