import {User} from '../admin/users.model';
import {Personnel} from '../members/emplyees.model';
import {ContributionType, InvestmentType} from '../contributions/contributions.model';
import {Accounts, Transactions} from '../banking/banking.model';

export class Payment {
    id?: number;
    ref: string;
    amount: number;
    merchantCharges: number;
    charges: number;
    txDate: Date;
    claimDate?: Date;
    confirmedDate?: Date;
    editor?: User;
    personnel: Personnel;
    eventLog: string;
    created_at: Date;
    particulars: PaymentParticulars[];
    paymentCharges?: PaymentCharge[];
}

export function roundCurrency(amount: number) {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export class PaymentParticulars {
    id?: number;
    type?: string;
    typeID?: number;
    amount: number;
    txDate: Date;
    investment?: InvestmentType;
    sub?: ContributionType;
    payment?: Payment;
    editor: User;
}

export class PaymentClaim {
    id?: number;
    ref: string;
    amount: number;
    charges: number;
    txDate: Date;
    claimDate: Date;
    editor: User;
    account: Accounts;
    tx?: Transactions;
}

export class PaymentCharge {
    id?: number;
    name: string;
    amount: number;
    optional: boolean;
    fixed: boolean;
    editor?: User;
}
