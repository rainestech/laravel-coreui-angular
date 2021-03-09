import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Channel} from "../../tasks/tasks.model";
import {DataService} from "../../service/data.service";
import {ChannelService} from "../channel.service";
import {UsersService} from "../../admin/users.service";
import {Cols, User} from "../../admin/users.model";
import {first} from "rxjs/operators";
import {Endpoints} from "../../../../../supreme/src/app/endpoints";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-channel-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  dataLoaded = false;
  title = 'Add New Channel';
  enableClose = true;
  channelForm: FormGroup;
  submitted = false;
  selectedMembers: User[] = [];
  members: User[] = [];
  cols: Cols[] = [];
  imageSrc: any[] = [];
  fsPath = '';

  @Input() channel: Channel;
  @Output() outChannel = new EventEmitter<Channel>();
  @Output() closed = new EventEmitter<boolean>();

  users: User[] = [];
  loginUser: User;

  get f() { return this.channelForm.controls; }


  constructor(private dataService: DataService,
              private http: ChannelService,
              private messageSevice: MessageService,
              private formBuilder: FormBuilder,
              private userService: UsersService) { }

  ngOnInit(): void {
    this.imageSrc['passport'] = 'assets/img/avatars/1.jpg';
    this.fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/';
    this.loginUser = this.dataService.getUser();
    this.userService.getUsers().pipe(first()).subscribe(res => {
      this.users = res;
      this.initForm();
      this.dataLoaded = true;
      console.log(this.dataLoaded);
    });

    this.cols = [
      {header: 'Name', field: 'Name'},
    ]
  }

  close() {
    this.closed.emit(true);
  }

  submitChannel() {
    this.channelForm.updateValueAndValidity();
    this.submitted = true;
    if (this.channelForm.invalid) {
      return;
    }

    const data: Channel = this.channelForm.value;
    data.members  = this.selectedMembers;

    if (this.channel) {
      this.http.editChannel({...this.channel, ...data}).pipe(first()).subscribe(res => {
        this.messageSevice.add({
          severity: 'success',
          summary: 'Channel Information Saved Successfully'
        });

        this.outChannel.emit(res);
        this.closed.emit(true);
      });
    } else {
      this.http.saveChannel(data).pipe(first()).subscribe(res => {
        this.messageSevice.add({
          severity: 'success',
          summary: 'Channel Information Saved Successfully'
        });

        this.outChannel.emit(res);
        this.closed.emit(true);
      });
    }
  }

  private initForm() {
    const data: Channel = this.channel ? this.channel : new Channel();
    this.channelForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
    });

    this.sortMembers(data.members);
  }

  private static getMemberIds(members: User[]): number[] {
    if (members)
      return members.map(m => m.id);

    return [];
  }

  private sortMembers(members: User[]) {
    this.members = this.users;

    if (members) {
      this.selectedMembers = members;
      members.forEach(m => {
        this.members.filter(t => t.id !== m.id);
      });
    }
  }

  removeMember(data: User) {
    this.selectedMembers = this.selectedMembers.filter(s => s.id !== data.id);
    this.members = [data, ...this.members];
  }

  addMember(data: User) {
    this.members = this.members.filter(s => s.id !== data.id);
    this.selectedMembers = [data, ...this.selectedMembers];
  }
}
