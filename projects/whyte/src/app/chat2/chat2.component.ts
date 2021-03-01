import {Component, Inject, LOCALE_ID, NgZone, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {DataService} from "../service/data.service";
import {User} from "../admin/users.model";
import {Endpoints} from "../endpoints";
import {ChatService} from "./chat.service";
import {first} from "rxjs/operators";
import {FormControl, Validators} from "@angular/forms";


@Component({
  selector: 'app-chat2',
  templateUrl: './chat2.component.html',
  styleUrls: ['./chat2.component.scss']
})
export class Chat2Component implements OnInit, OnDestroy {

  selectedTab = 'chat';
  loginUser: User;
  fsPath = '';
  recentChats: any;
  chats: any[];
  status: any;
  friends: any[] = [];
  contacts: any[] = [];
  dataLoaded = false;
  chatStatusList = [];
  selectedChat = null;
  activeChat: any[];
  activeChat$: any;
  chatMsg = new FormControl('', Validators.required);
  private lastDay: any[] = [];
  lastSeen: string;

  constructor(@Inject( LOCALE_ID ) private locale: string,
              private firestore: AngularFirestore,
              private _ngZone: NgZone,
              private http: ChatService,
              private dataService: DataService) {}

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    if (this.loginUser?.passport) {
      this.fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/' + this.loginUser.passport.link;
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
          this.chats = res.filter(r => r.from.id !== this.loginUser.id);
        });
  }

  private getFriends() {
    this.http.getFriends().pipe(first()).subscribe(res => {
      this.friends = res;
      this.dataLoaded = true;
    })
  }

  private getContacts() {
    this.http.getContacts().pipe(first()).subscribe(res => {
      this.contacts = res.filter(e => e.id !== this.loginUser.id);
      console.log(res.map(a => a.id));
      this.status = this.firestore.collection('/status', ref => ref.where('from.id', 'in', res.map(a => a.id)))
          .valueChanges().subscribe(res => {
          this.chatStatusList = res;
          console.log(res);
      });
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
    this.activeChat$ = this.firestore.collection('/chats', ref =>
      ref.where('to', '==', this.getTo(this.loginUser.id, from.id))
          // .where('to', 'array-contains', from.id)
          .orderBy('date', 'asc')
          .limit(100))
        .valueChanges().subscribe(snapshot => {
          this.activeChat = snapshot;
        });

    this.selectedChat = from;
    this.lastSeen = this.chatStatusList.find(s => s.from.id === this.selectedChat.id)?.date;
  }

  sendMsg() {
    if (this.chatMsg.invalid) { return; }

    this.firestore.collection('/chats').add({
      from: { id: this.loginUser.id, avatar: this.fsPath, name: this.loginUser.name },
      message: this.chatMsg.value,
      type: 'message',
      date: new Date().toISOString(),
      to: this.getTo(this.loginUser.id, this.selectedChat.id),
      read: false
    }).then(() => {
      this.chatMsg.reset('');
    });
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
}