import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {PaymentsService} from './payments.service';
import {MessageService, SelectItem} from 'primeng/api';
import {Personnel} from '../members/emplyees.model';
import {Contributions, ContributionType, Investment, InvestmentType} from '../contributions/contributions.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {forkJoin} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {ContributionsService} from '../contributions/contributions.service';
import {Payment, PaymentCharge, PaymentParticulars, roundCurrency} from './payment.model';

@Component({
  selector: 'app-make-payments',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css']
})
export class MakePaymentComponent implements OnInit {
  @Input() newPayment: {personnel: Personnel; contributions: Contributions[]; investment: Investment[]};

  investments: Investment[] = [];
  contributions: Contributions[] = [];
  paymentForm: FormGroup;
  date = new Date();
  dataLoaded = false;
  modalRef: BsModalRef;
  @Input() header = true;
  @Input() enableClose = true;
  @Output() closePayment = new EventEmitter<Boolean>();
  itemOpts: SelectItem[] = [];
  editType: ContributionType;
  charges: PaymentCharge[] = [];
  private totalCharges = 0;
  totalPayment = 0;
  subTotal = 0;
  gatewayCharge = 0;
  invoiceNo: any;
  selAddSub = true;
  selID: number;
  private investmentTypes: InvestmentType[];
  private subTypes: ContributionType[];
  payment: Payment;
  view = 1;
  reference = '';
  constructor(private http: PaymentsService,
              private contributionService: ContributionsService,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.newPayment.contributions.forEach(c => {
      const con = new Contributions();
      con.type = c.type;
      con.subAmount = c.subAmount;
      con.amount = 0;
      con.id = c.id;
      this.contributions.push(con);
    });

    this.newPayment.investment.forEach(i => {
      const inv = new Investment();
      inv.type = i.type;
      inv.units = 0;
      inv.worth = 0;
      inv.id = i.id;
      this.investments.push(inv);
    });
    this.setItemOpts();
    this.reference = 'fiscos-invoice-p.' + this.newPayment.personnel.id + '-'
      + new Date().getDate()
      + new Date().getMonth()
      + new Date().getFullYear()
      + new Date().getHours()
      + new Date().getMinutes()
      + new Date().getSeconds();

    this.invoiceNo = this.reference.replace('fiscos-invoice-', '');
  }

  close() {
    this.closePayment.emit(true);
  }

  incInvestment(inv: Investment, b: boolean = true) {
    if (b) {
      inv.worth = inv.worth + inv.type.unitPrice;
      inv.units++;
    } else if (inv.worth > 0) {
      inv.worth = inv.worth - inv.type.unitPrice;
      inv.units--;
    }
    this.investments[this.investments.indexOf(this.investments.find(i => i.type.id === inv.type.id))] = inv;
  }

  addNewItem(temp: TemplateRef<any>) {
    this.paymentForm = this.formBuilder.group({
      'item': ['', Validators.required],
      'amount': [''],
      'units': [''],
    });

    this.paymentForm.controls.item.valueChanges.subscribe(value => {
      this.selAddSub = value.includes('c');
      this.selID = +value.replace(/\D/g, '');
      if (this.selAddSub) {
        this.paymentForm.controls.amount.setValidators([Validators.required]);
        this.paymentForm.controls.units.clearValidators();
      } else {
        this.paymentForm.controls.amount.clearValidators();
        this.paymentForm.controls.units.setValidators([Validators.required, Validators.min(1)]);
      }
      this.paymentForm.controls.amount.updateValueAndValidity({onlySelf: true, emitEvent: false});
      this.paymentForm.controls.units.updateValueAndValidity({onlySelf: true, emitEvent: false});
    });

    this.modalRef = this.modalService.show(temp);
  }

  private setItemOpts() {
    forkJoin([
      this.contributionService.getInvestmentTypes(),
      this.http.getCharges(),
      this.contributionService.getTypes(),
    ]).pipe(map(([investments, charges, type]) => ({investments, charges, type})))
        .subscribe(res => {
          res.investments.forEach(r => {
            if (!this.newPayment.investment.find(i => i.type.id === r.id)) {
              this.itemOpts.push({value: 'i' + r.id, label: r.name + ' Investment'});
            }
          });

          this.investmentTypes = res.investments;
          this.subTypes = res.type;
          res.type.forEach(r => {
            if (!this.newPayment.contributions.find(i => i.type.id === r.id)) {
              this.itemOpts.push({value: 'c' + r.id, label: r.name + ' Contribution'});
            }
          });
          this.charges = res.charges.filter(c => !c.optional);
          this.dataLoaded = true;
        });
  }

  toggle(sub: Contributions) {
    this.editType = sub.type;
  }

  focusOff() {
    this.editType = null;
  }

  getSubTotal() {
    this.subTotal = this.contributions.reduce((a, b) => a + +b.amount, 0)
        + this.investments.reduce((a, b) => a + +b.worth, 0);
    return this.subTotal;
  }

  getChargeValue(chg: PaymentCharge) {
    if (chg.fixed) {
      return chg.amount;
    } else {
      return chg.amount * this.subTotal;
    }
  }

  private getGatewayCharges() {
    let total = 0;
     this.charges.forEach(ch => {
      if (ch.fixed) {
        total = total + ch.amount;
      } else {
        total = total + ch.amount * this.subTotal;
      }
    });
    this.totalCharges = total;

    const tot = +this.totalCharges + +this.subTotal;
    if (((tot / (1 - 0.015)) - tot) > 2000) {
      this.gatewayCharge = 2000;
      this.totalPayment = tot + 2000;
    } else if (tot < 2500) {
      this.gatewayCharge = (tot / (1 - 0.015)) - tot;
      this.totalPayment = tot / (1 - 0.015);
    } else {
      this.gatewayCharge = ((tot + 100) / (1 - 0.015)) - tot;
      this.totalPayment = (tot + 100) / (1 - 0.015);
    }
    return this.gatewayCharge;
  }

  pay(ref: any) {
    const p = new Payment();
    p.amount = this.getTotalPayment();
    p.charges = roundCurrency(this.totalCharges);
    p.paymentCharges = this.charges;
    p.merchantCharges = roundCurrency(this.gatewayCharge);
    p.personnel = this.newPayment.personnel;
    p.particulars = this.getParticulars();
    p.txDate = new Date();
    p.ref = this.reference;
    p.eventLog = JSON.stringify(ref);
    this.payment = p;
    if (ref.status) {
      this.postPayment();
    }
  }

  addItem() {
    this.paymentForm.updateValueAndValidity();
    if (this.paymentForm.invalid) {
      this.messageService.add({
        severity: 'warming',
        summary: 'Invalid Input'
      });
      return;
    }

    if (this.selAddSub) {
      const con  = new Contributions();
      con.type = this.subTypes.find(t => t.id === this.selID);
      con.subAmount = +this.paymentForm.controls.amount.value;
      con.amount = +this.paymentForm.controls.amount.value;
      this.contributions.push(con);
    } else {
      const inv = new Investment();
      inv.type = this.investmentTypes.find(t => t.id === this.selID);
      inv.units = +this.paymentForm.controls.units.value;
      inv.worth = inv.units * inv.type.unitPrice;
      this.investments.push(inv);
    }

    this.modalRef.hide();
  }

  private getParticulars() {
    const p: PaymentParticulars[] = [];
    this.investments.forEach(i => {
      if (i.units > 0) {
        const pa = new PaymentParticulars();
        pa.amount = i.worth;
        pa.investment = i.type;

        p.push(pa);
      }
    });

    this.contributions.forEach(i => {
      if (i.amount > 0) {
        const pa = new PaymentParticulars();
        pa.amount = i.amount;
        pa.sub = i.type;

        p.push(pa);
      }
    });

    return p;
  }

  paymentCancel() {

  }

  getTotalPayment() {
    return Math.round((this.totalPayment + Number.EPSILON) * 100) / 100;
  }

  postPayment() {
    this.http.postPayment(this.payment).pipe(first()).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Your Payment has been received. Please wait few minute for it to reflect on your account balances'
      });
    });
  }
}
