import {Lgas, States, User} from '../admin/users.model';
import {Occupation, Personnel} from '../members/emplyees.model';
import {Status} from 'tslint/lib/runner';
import {SelectItem} from 'primeng/api';
import {FormGroup, ValidationErrors} from '@angular/forms';

export class ContributionType {
  id?: number;
  name: string;
  description: string;
  noPerYear: number;
  minAmount: number;
  maxAmount: number;
  optional: boolean;
  fixed: boolean;
  editor: User;
}

export class BenefitType {
  id?: number;
  name: string;
  description: string;
  url: string;
  period: number;
  amount?: number;
  percentEarnings?: number;
  createdBy?: string;
  fixed: boolean;
  optional: boolean;
  editor: User;
}

export class Benefit {
  id?: number;
  txDate: Date;
  balance: number;
  amount: number;
  type: BenefitType;
  prevBalance: number;
  personnel: Personnel;
  createdBy: string;
  editor: User;
}

export class BenefitLog {
  id?: number;
  txDate: Date;
  balance: number;
  amount: number;
  prevBalance: number;
  personnel: Personnel;
  createdBy: string;
  editor: User;
  month: string;
  year: number;
  txType: string;
  type: BenefitType;
  benefit: Benefit;
}

export class InvestmentType {
  id?: number;
  name: string;
  description: string;
  url: string;
  totalUnits: number;
  availableUnits: number;
  unitPrice: number;
  initPrice: number;
  maturityDate: Date;
  amount: number;
  createdBy: string;
  editor: User;
}

export class Investment {
  id?: number;
  units: number;
  worth: number;
  dividends: number;
  personnel: Personnel;
  createdBy: string;
  editor: User;
  type: InvestmentType;
  createdAt: Date;
}

export class InvestmentLog {
  id?: number;
  txDate: Date;
  txType: string;
  units: number;
  balance: number;
  ref: string;
  unitPrice: number;
  amount: number;
  type: InvestmentType;
  investment: Investment;
  personnel: Personnel;
  createdBy: string;
  editor: User;
}

export class DividendLog {
  id?: number;
  txDate: Date;
  txType: string;
  balance: number;
  ref: string;
  amount: number;
  investment: Investment;
  personnel: Personnel;
  createdBy: string;
  editor: User;
}

export class Assets {
  id?: number;
  user: User;
  lastName: string;
  firstName: string;
  otherNames: string;
  maidenName: string;
  dob: Date;
  joinDate: Date;
  maritalStatus: string;
  nationality: string;
  states: States;
  lgas: Lgas;
  status: Status;
  homeAddress: string;
  address: string;
  name: string;
  gender: string;
  createdAt: Date;
  occupation: Occupation;
  assets: Contributions[];
}

export class Contributions {
  id?: number;
  type: ContributionType;
  personnel: Personnel;
  subAmount: number;
  amount: number;
  contribCount: number;
  subDate: Date;
  lastTxDate: Date;
  lastAmount?: number;
  target: number;
  bf: number;
  editor: User;
}

export class Payments {
  id?: number;
  subs: Contributions;
  amount: number;
  balance: number;
  prevBalance: number;
  lastAmount: number;
  year: number;
  month: string;
  txDate: Date;
  subAmount: number;
  ref: string;
  channel: string;
  editor: User;
}

export class TransferSubs {
  id?: number;
  fromSub: Contributions;
  toSub: Contributions;
  amount: number;
  balanceFrom: number;
  prevBalanceFrom: number;
  balanceTo: number;
  prevBalanceTo: number;
  year: number;
  month: string;
  txDate: Date;
  editor: User;
  remarks: string;
}

export const cycles: SelectItem[] = [
  {label: 'Annual', value: 1},
  {label: 'Bi-Annual', value: 2},
  {label: 'Quarterly', value: 3},
  {label: 'Bi-Monthly', value: 6},
  {label: 'Monthly', value: 12},
];

export const periods: SelectItem[] = [
  {value: 1, label: 'Annually'},
  {value: 2, label: 'Bi-Annual'},
  {value: 3, label: 'Tri-Annual'},
  {value: 4, label: 'Quarterly'},
  {value: 6, label: 'Bi-Monthly'},
  {value: 12, label: 'Monthly'},
];

export function getFormValidationErrors(form: FormGroup) {
  Object.keys(form.controls).forEach(k => {
    const errors: ValidationErrors = form.get(k).errors;
    if (errors != null) {
      Object.keys(errors).forEach(e => {
        console.log('Key Control: ' + k + ', Error: ' + e + ', err value: ', errors[e]);
      });
    }
  });
}

export function getPeriodLabel(noPerAnum: number) {
  const data: SelectItem = cycles.find(p => p.value === noPerAnum);
  if (data) {
    return data.label;
  }

  return '';
}


