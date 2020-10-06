import {Component, Input, OnInit} from '@angular/core';
import {Personnel} from '../../members/emplyees.model';
import {Payments} from '../contributions.model';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {
  personnel: Personnel;
  dataLoaded = false;
  header = true;
  @Input() log: Payments;

  constructor() {
  }

  ngOnInit(): void {
    this.personnel = this.log.subs.personnel;
    this.dataLoaded = true;
  }

  closeReport() {

  }

  print() {

  }

  delPayment() {

  }

  editPayment() {

  }
}
