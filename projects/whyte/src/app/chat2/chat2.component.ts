import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {DataService} from "../service/data.service";
import {User} from "../admin/users.model";


@Component({
  selector: 'app-chat2',
  templateUrl: './chat2.component.html',
  styleUrls: ['./chat2.component.scss']
})
export class Chat2Component implements OnInit {

  selectedTab = 'chat';
  loginUser: User;
  constructor(private firestore: AngularFirestore, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    this.firestore.collection('users').doc('test').set({
      id: 1,
      username: 'testUser'
    });
  }

}
