import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Personnel} from '../emplyees.model';
import {FileStorage} from '../../storage/storage.model';

@Component({
  selector: 'app-personnel-detail',
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
  @Input() personnel: Personnel;
  @Output() closeView = new EventEmitter<boolean>();
  passport: FileStorage[] = [];
  @Input() header = true;
  @Input() template: string = 'full';
  @Input() disableUpload = false;

  ngOnInit(): void {
    let fs = this.personnel.user.passport;
    if (!fs) {
      fs = new FileStorage();
      fs.tag = 'passport';
      fs.objID = this.personnel.user.id;
    }

    this.passport = [fs];
  }

  closeReport() {
    this.closeView.emit(true);
  }

  print() {
    window.print();
  }

  viewDetails() {

  }
}
