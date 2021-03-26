import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Channel} from "../../tasks/tasks.model";
import {User} from "../../admin/users.model";
import {first} from "rxjs/operators";
import {ConfirmationService, MessageService} from "primeng/api";
import {ChannelService} from "../channel.service";
import {Endpoints} from "../../endpoints";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-channel-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  dataLoaded = false;
  @Input() channel: Channel;
  @Output() closed = new EventEmitter<boolean>();
  @Output() deleted = new EventEmitter<Channel>();
  @Output() outChannel = new EventEmitter<Channel>();
  p = 1;
  view = 1;
  fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/';
  loginUser: User;

  constructor(private confirmService: ConfirmationService,
              private messageService: MessageService,
              private dataService: DataService,
              private http: ChannelService) { }

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    this.dataLoaded = true;
  }

  removeUser(rec: User) {
    if (this.loginUser.role === 'CANDIDATES') {
      return;
    }
    this.confirmService.confirm({
      message: 'Are you sure you want to remove ' + rec.name + ' from Channel?',
      header: 'Remove User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.channel.members = this.channel.members.filter(m => m.id !== rec.id);
        this.http.editChannel(this.channel).pipe(first()).subscribe(
            res => {
              this.messageService.add({
                severity: 'success',
                summary: 'Remove Success', detail: 'User Removed from Channel!'
              });
              this.outChannel.emit(res);
              this.channel = res;
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  close() {
    this.closed.emit(true);
  }

  delete() {
    if (this.loginUser.role === 'CANDIDATES') {
      return;
    }
    this.confirmService.confirm({
      message: 'Are you sure you want to delete Channel?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteChannel(this.channel.id).pipe(first()).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: 'Channel Removed from Platform!'
              });
              this.deleted.emit(this.channel);
              this.closed.emit(true);
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  updateChannel(event: Channel) {
    this.outChannel.emit(event);
    this.channel = event;
  }
}
