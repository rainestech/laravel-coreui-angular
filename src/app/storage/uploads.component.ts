import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {FileStorage} from './storage.model';
import {StorageService} from './storage.service';
import {first} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {DataService} from '../services/data.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {StorageDataService} from './storage.data.service';
import {Endpoints} from '../endpoints';
import {MessageService} from 'primeng/api';
import {FileProperties, fileStorageToFormData, readFile} from '../admin/file.reader';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {
  imageSrc: any[] = [];
  @Input() uploadName = '';
  @Input() uploadType: string = 'passport';
  @Input() fileType: string[] = ['image'];
  @Input() uploadLabel = '';
  @Input() fileStorage: FileStorage[];
  @Input() maxSize = 100000;
  @Input() instantUpload = false;
  @Input() disableUpload = false;
  @Input() upload: boolean = false;
  @Input() viewFile: boolean = false;
  @Input() toastComplete: boolean = true;
  @Input() updateUserPassport: boolean = false;

  @Output() fileLoaded = new EventEmitter<boolean>();
  @Output() fileStorageUploads = new EventEmitter<FileStorage>();

  uploadError: any[] = [];
  fileLink: string = Endpoints.mainUrl + Endpoints.fsDL + '/';
  curViewFile: any;
  viewTemp: BsModalRef;
  private pendingUpload: FileProperties[] = [];
  private docUploadCount: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private currentDoc: Observable<number[]> = this.docUploadCount.asObservable();

  constructor(private http: StorageService,
              private dataStore: DataService,
              private storageData: StorageDataService,
              private modalService: BsModalService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.imageSrc['passport'] = 'assets/img/avatars/0.jpeg';
    this.imageSrc['document'] = 'assets/img/avatars/0.jpeg';
    if (this.upload) {
      this.uploadFiles();
    }

    this.storageData.currentData.subscribe(res => {
      if (res.find(t => t.tag === this.uploadName && t.upload)) {
        console.log('fs: upolad');
        this.uploadFiles();
      }
    });
  }

  readURL(event: any, fileType: string) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!this.validateFile(file, fileType)) {
        return;
      }

      this.uploadError[fileType] = null;
      readFile(file).then(e => {
        if (e.type === 'application/pdf') {
          this.imageSrc[fileType] = 'assets/img/avatars/1.png';
        } else {
          this.imageSrc[fileType] = e.file;
        }
        if (e.name) {
          this.pendingUpload = [];
          const fs = this.fileStorage.find(f => f.tag === fileType);
          if (fs) {
            this.fileStorage[this.fileStorage.indexOf(fs)].link = null;
          }
          this.fileLoaded.emit(true);
          this.pendingUpload = [...this.pendingUpload, e];
        }

        if (fileType === 'passport') {
          this.passportUpload();
          return;
        }

        if (this.fileStorage.find(r => r.objID && r.tag === fileType)) {
          this.uploadFiles();
          return;
        }
      });
    }
  }

  uploadFiles() {
    const k = [];
    // let i = 0;
    for (let i = 0; i < this.pendingUpload.length; i++) {
      const formData = fileStorageToFormData(this.pendingUpload[i], this.fileStorage[i]);
      this.http.saveFile(formData).pipe(first()).subscribe(
        res => {
          this.fileStorageUploads.emit(res);
          k.push(Math.random());
          this.docUploadCount.next(k);
        }, error => {
          this.docUploadCount.next([]);
        }
      );
    }

    this.currentDoc.subscribe(
      sub => {
        if (sub.length === this.pendingUpload.length) {
          this.docUploadCount.next([]);
          this.pendingUpload = [];

          if (this.toastComplete) {
            this.messageService.add({
              severity: 'success', summary: this.uploadLabel + ' Uploaded Successfully!'
            });
          }
        }
      });
  }

  passportUpload() {
    const formData = fileStorageToFormData(this.pendingUpload[0], this.fileStorage[0]);
    this.http.saveFile(formData).pipe(first()).subscribe(
      res => {
        if (this.fileStorage.length < 2) {
          this.fileStorage = [res];
        }
        this.fileStorageUploads.emit(res);
        if (this.updateUserPassport) {
          const user = this.dataStore.getUser();
          user.passport = res;
          this.dataStore.setUser(user);
        }

        if (this.toastComplete) {
          this.messageService.add({
            severity: 'success', summary: this.uploadLabel + ' Profile Picture Uploaded Successfully!'
          });
        }
      });
  }

  viewFileClick(file: FileProperties, pic: TemplateRef<any>, pdf: TemplateRef<any>) {
    this.curViewFile = file;
    if (file.raw.type.toLowerCase() === 'application/pdf') {
      this.viewTemp = this.modalService.show(pdf);
    } else {
      this.viewTemp = this.modalService.show(pic);
    }
  }

  private validateFile(file: File, fileType: string): boolean {
    if (this.fileType.includes('image') && file.type.toLowerCase().includes('image')) {
      if (file.type.toLowerCase() === 'image/png'
        || file.type.toLowerCase() === 'image/jpg'
        || file.type.toLowerCase() === 'image/jpeg') {
        return this.validateFileSize(file, fileType);
      }

      this.uploadError[fileType] = 'File must be an image of subscription png or jpeg/jpg only';
      return false;
    } else if (this.fileType.includes('pdf') && file.type.toLowerCase().includes('pdf')) {
      if (file.type.toLowerCase() !== 'application/pdf') {
        this.uploadError[fileType] = 'File must be an image of subscription pdf only';
        return false;
      }

      return this.validateFileSize(file, fileType);
    }

    this.uploadError[fileType] = 'File Format not Supported!';
    return false;
  }

  private validateFileSize(file: File, fileType: string): boolean {
    if (file.size > this.maxSize) {
      this.uploadError[fileType] = 'File must not be larger than ' + (this.maxSize / 1000).toFixed(0) + ' kb';
      return false;
    }

    return true;
  }
}
