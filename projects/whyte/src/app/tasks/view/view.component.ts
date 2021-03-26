import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Channel, Comments, priorityOptions, Tasks, validateFile} from "../tasks.model";
import {FormControl, Validators} from "@angular/forms";
import {ChannelService} from "../../channels/channel.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {DataService} from "../../service/data.service";
import {User} from "../../admin/users.model";
import {first} from "rxjs/operators";
import {Endpoints} from "../../endpoints";
import {FileProperties} from "../../admin/file.reader";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {fileStorageToFormData, readFile} from "../../../../../../src/app/admin/file.reader";

@Component({
  selector: 'app-task-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @Input() task: Tasks;
  @Input() channel: Channel;
  @Output() closed = new EventEmitter<boolean>();
  priorityOptions = priorityOptions;
  comment = new FormControl('', Validators.required);
  changePriority = false;
  changeName = false;
  priority = new FormControl('', Validators.required);
  loginUser: User;
  @Output() outTask = new EventEmitter<Tasks>();
  @Output() deleted = new EventEmitter<Tasks>();
  nameChange = new FormControl('', Validators.required);
  fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/';
  view = 1;
  date = new Date();

  pendingUpload: FileProperties;
  error: any;
  fileError: string;
  uploadResponse = { status: '', message: '', filePath: '' };
  uploading: boolean;
  token: string;
  uploadModal: BsModalRef;

  constructor(private http: ChannelService,
              private modalService: BsModalService,
              private messageService: MessageService,
              private confirmService: ConfirmationService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    this.task.channel = this.channel;
    this.priority.setValue(this.task.priority);
    this.nameChange.setValue(this.task.name);

    this.priority.valueChanges.subscribe(res => {
      this.task.priority = res;
      this.changePriority = !this.changePriority;
      this.put();
    });

    this.nameChange.valueChanges.subscribe(value => {
      this.task.name = value;
      this.changeName = !this.changeName;
      this.put();
    })
  }

  close() {
    this.closed.emit(true);
  }

  delete() {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete Task?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteTask(this.task.id).pipe(first()).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: 'Channel Removed from Platform!'
              });
              this.deleted.emit(this.task);
              this.closed.emit(true);
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  put() {
    this.http.updateTask(this.task).pipe(first()).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Task Updated Successfully'
      });

      this.outTask.emit(res);
    });
  }

  postComment() {
    if (this.comment.invalid) { return; }

    const data: Comments = new Comments();
    data.comment = this.comment.value;
    data.task = this.task;
    data.task.channel = this.channel;

    this.http.saveComments(data).pipe(first()).subscribe(res => {
      if (!this.task.comments) {
        this.task.comments = [];
      }
      this.task.comments = [...this.task.comments, res];
      this.comment.reset();
    });
  }

  deleteComment(comm: Comments) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete comment?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteComment(comm.id).pipe(first()).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: 'Comment deleted!'
              });
              this.task.comments = this.task.comments.filter(c => c.id !== comm.id);
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  upload(temp: TemplateRef<any>) {
    this.fileError = '';
    this.uploadModal = this.modalService.show(temp, {backdrop: 'static', keyboard: false});
  }

  readURL(event: any, fileType: string) {
    this.fileError = '';
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const val = validateFile(file, fileType, 1024000);
      if (val !== true) {
        this.fileError = val;
        return;
      }

      readFile(file).then(e => {
        if (e.name) {
          this.pendingUpload = e;
        }
      });
    }
  }


  postFile() {
    if (this.comment.invalid) {
      return;
    }
    this.uploading = true;
    const formData = fileStorageToFormData(this.pendingUpload, { tag: 'comment', objID: 0});
    this.http.saveFile(formData).pipe(first()).subscribe(res => {
      this.uploadResponse = res;

      const data: Comments = new Comments();
      data.comment = this.comment.value;
      data.task = this.task;
      data.file = res;

      this.http.saveComments(data).pipe(first()).subscribe(res => {
        if (!this.task.comments) {
          this.task.comments = [];
        }
        this.task.comments = [...this.task.comments, res];
        this.comment.reset();
        this.uploading = true;
        this.uploadModal.hide();
      });
    });
  }

  downloadFile(docs: any) {
    window.open(Endpoints.mainUrl + '/api/v1/docs/dl/' + docs.link + '?token=' + encodeURIComponent(this.token),
        '_blank');

    return false;
  }
}
