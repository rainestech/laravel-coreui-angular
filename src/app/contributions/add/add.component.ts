import {Component, OnInit} from '@angular/core';
import {Personnel} from '../../members/emplyees.model';
import {Contributions} from '../contributions.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  personnel: Personnel;

  constructor() {
  }

  ngOnInit(): void {
  }

  getData(event: Personnel) {
    this.personnel = event;
  }

  submitted(event: Contributions) {
    this.personnel = null;
  }
}
