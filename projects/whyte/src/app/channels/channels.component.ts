import { Component, OnInit } from '@angular/core';
import {DataService} from "../service/data.service";
import {ChannelService} from "./channel.service";
import {User} from "../admin/users.model";
import {first} from "rxjs/operators";
import {Channel} from "../tasks/tasks.model";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
    dataLoaded = false;
    loginUser: User;
    channels: Channel[] = [];
    curChannel: Channel;
    view = 1;

  constructor(private dataService: DataService,
              private http: ChannelService,
              private messageService: MessageService,
              private confirmService: ConfirmationService) { }

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    this.refresh();
  }

  refresh() {
    if (this.loginUser.role.includes('ADMIN')) {
      this.http.getChannels().pipe(first()).subscribe(res => {
        this.channels = res;
        this.dataLoaded = true;
      });
    } else {
      this.http.getMyChannels().pipe(first()).subscribe(res => {
        this.channels = res;
        this.dataLoaded = true;
      });
    }
  }

  viewChannel(data: Channel) {
    this.curChannel = data;
    this.view = 3;
  }

  addChannel(channel: Channel) {
    this.curChannel = channel;
    this.view = 2;
  }

  newChannel(event: Channel) {
    this.channels = this.channels.filter(c => c.id !== event.id);
    this.channels = [event, ...this.channels];
  }

  close(event: boolean) {
    if (event)
      this.view = 1;
  }

  deleteChannel(data: Channel) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete Channel?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteChannel(data.id).pipe(first()).subscribe(
            () => {
              this.channels = this.channels.filter(f => f.id !== data.id);
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: 'Channel Removed from Platform!'
              });
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  removeChannel(event: Channel) {
    this.channels = this.channels.filter(c => c.id != event.id);
  }
}
