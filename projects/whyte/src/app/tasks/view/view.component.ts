import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Channel, Comments, priorityOptions, Tasks} from "../tasks.model";
import {FormControl, Validators} from "@angular/forms";
import {ChannelService} from "../../channels/channel.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {DataService} from "../../service/data.service";
import {User} from "../../admin/users.model";
import {first} from "rxjs/operators";
import {Endpoints} from "../../endpoints";

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

  constructor(private http: ChannelService,
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
}
