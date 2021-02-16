import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  view = 2;
  constructor() { }

  ngOnInit(): void {
  }

  editProfile() {
      this.view = 2;
  }
}
