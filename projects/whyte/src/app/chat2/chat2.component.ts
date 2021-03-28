import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component, ElementRef,
  Inject,
  LOCALE_ID,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef, ViewChild
} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {DataService} from "../service/data.service";
import {User} from "../admin/users.model";
import {Endpoints} from "../endpoints";
import {ChatService} from "./chat.service";
import {first} from "rxjs/operators";
import {FormControl, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ChannelService} from "../channels/channel.service";
import {Channel, Comments, validateFile} from "../tasks/tasks.model";
import {fileStorageToFormData, readFile} from "../../../../../src/app/admin/file.reader";
import {FileProperties} from "../admin/file.reader";
import {MessageService} from "primeng/api";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-chat2',
  templateUrl: './chat2.component.html',
  styleUrls: ['./chat2.component.scss']
})
export class Chat2Component implements OnInit, OnDestroy, AfterViewChecked {

  selectedTab = 'chat';
  loginUser: User;
  fsPath = '';
  recentChats: any;
  chats: any[] = [];
  status: any;
  friends: any[] = [];
  contacts: any[] = [];
  dataLoaded = false;
  chatLoaded = false;
  chatStatusList = [];
  selectedChat = null;
  activeChat: any[];
  activeChat$: any;
  chatMsg = new FormControl('', Validators.required);
  private lastDay: any[] = [];
  lastSeen: string;
  asideMenu: BsModalRef;
  asideActive = false;
  viewEmoji = false;
  channels: Channel[] = [];
  newAlerts: number[] = [];
  _timestamps: string[] = [];
  group: boolean = false;
  uploading = false;
  uploadModal: BsModalRef;
  fileError = '';
  comment = new FormControl('');
  uploadResponse = { status: '', message: '', filePath: '' };
  pendingUpload: FileProperties;
  token: string;
  filePath = Endpoints.mainUrl + Endpoints.fsDL + '/';
  private disableScrollDown: boolean = false;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(@Inject( LOCALE_ID ) private locale: string,
              private route: ActivatedRoute,
              private firestore: AngularFirestore,
              private channelService: ChannelService,
              private modalService: BsModalService,
              private messageService: MessageService,
              private _ngZone: NgZone,
              private http: ChatService,
              private dataService: DataService) {}

  ngOnInit(): void {
    this.token = this.dataService.getToken();
    this.loginUser = this.dataService.getUser();
    if (this.loginUser?.passport) {
      this.fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/' + this.loginUser.passport.link;
    } else if (this.loginUser.avatar) {
      this.fsPath = this.loginUser.avatar;
    }

    this.getFriends();
    this.getContacts();

    this.firestore.collection('/status').doc(this.loginUser.id + '').set({
      from: { id: this.loginUser.id, avatar: this.fsPath, name: this.loginUser.name },
      message: 'online',
      type: 'status',
      date: new Date().toISOString()
    });

    this.recentChats = this.firestore.collection("/chats", ref => ref.where('to', 'array-contains', this.loginUser.id))
        .valueChanges().subscribe((res: any) => {
          res = res.sort((a, b) => (a.date > b.date ? -1 : 1));
          res.filter(r => r.from.id !== this.loginUser.id).forEach(c => {
            if (!this.chats.find(f => f.from.id === c.from.id)) {
              this.chats = [...this.chats, c];

              if (this.chatLoaded) {
                // this.messageService.add({
                //   severity: 'info',
                //   summary: 'You have a new message from ' + c.from.name
                // });
                this.newAlerts = [...this.newAlerts, c.from.id];
              }
            } else {
              if (!this._timestamps.includes(c.date) && this.chatLoaded) {
                // this.messageService.add({
                //   severity: 'info',
                //   summary: 'You have a new message from ' + c.from.name
                // });
                this.newAlerts = [...this.newAlerts, c.from.id];
              }
            }
            this._timestamps.push(c.date);
          });
          this.chatLoaded = true;
        });

    if (this.route.snapshot.paramMap.get('id')) {
      this.getChannels(+this.route.snapshot.paramMap.get('id'));
    } else {
      this.getChannels();
    }
  }

  private getFriends() {
    this.http.getFriends().pipe(first()).subscribe(res => {
      this.friends = res;
      this.dataLoaded = true;
    })
  }

  private getChannels(id = null) {
    this.channelService.getMyChannels().pipe(first()).subscribe(res => {
      this.channels = res;

      if (id) {
        this.groupChat(res.find(i => i.id === id));
      }
    });
  }

  private getContacts() {
    this.http.getContacts().pipe(first()).subscribe(res => {
      this.contacts = res.filter(e => e.id !== this.loginUser.id);
      this.status = this.firestore.collection('/status')
          .valueChanges().subscribe(res => {
          this.chatStatusList = res;
      });
      this.dataLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.status?.unsubscribe();
    this.activeChat$?.unsubscribe();
    this.recentChats?.unsubscribe();
    this.firestore.collection('/status').doc(this.loginUser.id + '').set({
      from: { id: this.loginUser.id, avatar: this.fsPath, name: this.loginUser.name },
      message: 'offline',
      type: 'status',
      date: new Date().toISOString()
    }).then(() => {
      console.log("NGDestroyed");
    });
  }

  getAvatarLink(selectedChat: any) {
    if (selectedChat.avatar.length > 0 && (selectedChat.avatar.includes('http') || selectedChat.avatar.includes('assets'))) {
      return selectedChat.avatar;
    }

    if (selectedChat.avatar.length > 0 && !(selectedChat.avatar.includes('http') || selectedChat.avatar.includes('assets'))) {
      return Endpoints.mainUrl + Endpoints.fsDL + '/' + selectedChat.avatar;
    }

    return '';
  }

  statusBadge(selectedChat: any) {
    return this.chatStatusList.find(s => s.from.id === selectedChat.id && s.message === 'online') ? 'avatar-status badge-success' : 'avatar-status badge-danger';
  }

  isOnline(from: any) {
    return this.chatStatusList.find(s => s.from.id === from.id && s.message === 'online') !== undefined;
  }

  getLastSeen() {
    return this.chatStatusList.find(s => s.from.id === this.selectedChat.id && s.message === 'online') ?
         'Online' : this.chatStatusList.find(s => s.from.id === this.selectedChat.id) ?
        this.chatStatusList.find(s => s.from.id === this.selectedChat.id).date : '';
  }

  chatFriend(from: any) {
    this.group = false;
    this.activeChat$ = this.firestore.collection('/chats', ref =>
      ref.where('to', '==', this.getTo(this.loginUser.id, from.id))
          // .where('to', 'array-contains', from.id)
          .orderBy('date', 'asc')
          .limit(100))
        .valueChanges().subscribe(snapshot => {
          this.activeChat = snapshot;
          this.newAlerts = this.newAlerts.filter(i => i !== from.id);
        });

    this.selectedChat = from;
    this.lastSeen = this.chatStatusList.find(s => s.from.id === this.selectedChat.id)?.date;
  }

  sendMsg(file = null) {
    if (this.chatMsg.invalid) { return; }

    if (!this.group) {
      this.firestore.collection('/chats').add({
        from: { id: this.loginUser.id, avatar: this.fsPath, name: this.loginUser.name },
        message: this.chatMsg.value,
        type: 'message',
        date: new Date().toISOString(),
        file: file,
        to: this.getTo(this.loginUser.id, this.selectedChat.id),
        read: false
      }).then(() => {
        this.chatMsg.reset('');
      });
    } else {
      this.firestore.collection('/channels').add({
        from: { id: this.loginUser.id, avatar: this.fsPath, name: this.loginUser.name },
        message: this.chatMsg.value,
        type: 'message',
        date: new Date().toISOString(),
        read: [],
        id: this.selectedChat.id,
        file: file,
      }).then(() => {
        this.chatMsg.reset('');
      });

      this.scrollToBottom();
    }
  }

  private getTo(userId: number, friendId: number) : number[] {
    const data = [userId, friendId];
    return data.sort((n1,n2) => n1 - n2);
  }

  getChatDate(chat: any) {
    if (this.lastDay.includes(chat)) {
      this.lastDay.push(chat);
      return true;
    } else {
      return false;
    }
  }

  showAsideBar(temp: TemplateRef<any>) {
    this.asideMenu = this.modalService.show(temp, {class: 'modal-aside modal-right'});
    this.asideActive = true;
  }

  addEmoji(event: any) {
    this.chatMsg.patchValue(this.chatMsg.value + event.emoji.native);
    this.viewEmoji = false;
  }

  groupChat(channel: Channel) {
    this.group = true;
    this.activeChat$ = this.firestore.collection('/channels', ref =>
        ref.where('id', '==', channel.id)
            .orderBy('date', 'asc')
            .limit(100))
        .valueChanges().subscribe(snapshot => {
          this.activeChat = snapshot;
        });

    this.selectedChat = channel;
  }

  deleteConversations() {

  }

  getMembersOnline() {
    let resp = 0;
    this.selectedChat.members.forEach(m => {
      if (this.chatStatusList.find(s => s.from.id === m.id && s.message === 'online') !== undefined) {
        resp = resp + 1;
      }
    });

    return resp;
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
    const formData = fileStorageToFormData(this.pendingUpload, { tag: 'chat', objID: 0});
    this.channelService.saveFile(formData).pipe(first()).subscribe(res => {
      this.uploadResponse = res;
      this.chatMsg.setValue(this.comment.value);

      const file = {
        name: res.name,
        link: res.link,
        fileType: res.fileType
      };
      this.sendMsg(file);
      this.comment.reset();
      this.uploading = false;
      this.uploadModal.hide();
    });
  }


  downloadFile(docs: any) {
    // const data = Endpoints.mainUrl + '/api/v1/docs/dl/' + doc.file.link + '?token=' + this.token;
    window.open(Endpoints.mainUrl + '/api/v1/docs/dl/' + docs.link + '?token=' + encodeURIComponent(this.token),
        '_blank');

    return false;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onScroll() {
    let element = this.myScrollContainer.nativeElement;
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (this.disableScrollDown && atBottom) {
      this.disableScrollDown = false
    } else {
      this.disableScrollDown = true
    }
  }


  private scrollToBottom(): void {
    if (this.disableScrollDown) {
      return
    }
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  countBadge(id: any) {
    return this.newAlerts.filter(i => i === id).length;
  }
}
