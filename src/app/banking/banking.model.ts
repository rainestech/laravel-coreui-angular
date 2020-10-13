import {Banks, User} from '../admin/users.model';

export class ChartLog {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  chart: Charts;
  transaction: Transactions;
  year: number;
  month: string;
  amount = 0.0;
  balance = 0.0;
  transDate: Date;
  accountChart: AccountChart;
  action: string;
}

export class Charts {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  accountChart: AccountChart;
  logs: ChartLog[];
  balance = 0.0;
  bf = 0.0;
  pyBalance = 0.0;
  year: number;
}

export class AccountChart {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  parent: AccountChart;
  children: AccountChart[];
  category: Category;
  headNo: number;
  subHeadNo: number;
  parentChild: string[];
  annualReset = true;
  code: string;
}

export class Category {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  type: string;
}

export function getRealParent(data: AccountChart, firsts = true) {
  if (data === null || data.parent === null) {
    return 0;
  } else if (firsts === true) {
    if (data.parent.parent === null) {
      return 0;
    } else {
      return data.parent.id;
    }
  } else if (data.parent.parent === null) {
    return data.parent.id;
  } else {
    return data.parent.parent.id;
  }
}

export function getRealParentModel(data: AccountChart, firsts = true) {
  if (data.parent === null) {
    return null;
  } else if (firsts === true) {
    return data.parent;
  } else if (data.parent.parent === null) {
    return data.parent;
  } else {
    return data.parent.parent;
  }
}


export class Budget {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  accountChart: AccountChart;
  year: string;
  proposed: number;
  proposedYr1: number;
  proposedYr2: number;
  actual: number;
  actualYr1: number;
  actualYr2: number;
  balance: number;
  approved: boolean;
  active: boolean;
  remarks: string;
}

export class BudgetItems {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  code: string;
  currency: string;
  category: BudgetCategory;
}

export class BudgetCategory {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  parent: BudgetCategory;
  children: BudgetCategory[];
  orderSerial: string;
  type: string;
  childCategories: string[];
  parentCategory: string;
}

export class Accounts {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  name;
  currency: string;
  bank: Banks;
  bankAddress: string;
  accountNo: string;
  openingBalance: number;
  balance: number;
  phoneNo: string;
  defaultAccount: boolean;
  status: boolean;
  description: string;
  manager: string;
  sortCode: string;
  bf?: number;
}

export class Currency {
  name: string;
  icon: string;
  html: string;
  code: string;
}

export const currencies: Currency[] = [
  {name: 'Euro', html: '8364', icon: '', code: 'EUR'},
  {name: 'Naira', html: '8358', icon: '', code: 'NGN'},
  {name: 'Pound', html: '8356', icon: '', code: 'GBP'},
  {name: 'Dollar', html: '8356', icon: '', code: 'USD'},
  {name: 'Yuan', html: '8356', icon: '', code: 'CYN'},
];

export class Transfers {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  fromAccount: Accounts;
  toAccount: Accounts;
  amount: number;
  txDate: Date;
  description: string;
  paymentMethod;
  reference: string;
  budget: Budget;
  editorName: string;
}

export class Transactions {
  id?: number;
  editor?: User;
  editorId: number;
  createdAt: Date;
  updatedAt: Date;
  txDate: Date;
  reference: string;
  voucherNo: string;
  code: string; // used in advance to search
  txType: string; // debit or credit
  amount: number;
  prevAmount: number;
  balance: number;
  budgetBalance: number;
  remarks: string;
  budget: Budget;
  transfer: Transfers;
  reconciliation: Reconciliation;
  category: string; // module using this
  cleared: boolean;
  clrBudget: boolean;
  edited: boolean;
  editorName: string;
  month: string;
  year: string;
  accountChart: AccountChart;
  chartTxType: string;
  account?: Accounts;
}

export function txFormData(rel: any, m: File, className: string, id = null): FormData {
  const formData: FormData = new FormData();
  formData.append('txID', String(rel.id));
  formData.append('file', m);
  formData.append('className', className);

  if (+id) {
    formData.append('id', id);
  }
  return formData;
}

export class TxFiles {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  fileName: string;
  fileType: string;
  name: string;
  file: File;
  data: any;
  className: string;
  txID: number;
  transactions: Transactions;
}

export class Reconciliation {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  month: string;
  year: string;
  accounts: Accounts;
  closingBalance: number;
  totalCredit: number;
  totalDebit: number;
  clearAmount: number;
  reconciled: boolean;
  edited: boolean;
  difference: number;
  transactions: Transactions[];
  balanceBF: number;
}

// export class MonthlyBalance {
//   accounts: Accounts;
//   month: string;
//   year: string;
//   calcBal: number;
//   adjBal: number;
//   description: string;
//   closeDate: Date;
// }

export const months: string[] = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

export function getBudgetRemBal(curTx: Transactions) {
  const proposed = curTx.budget.proposed;
  const actual = curTx.budgetBalance;
  if (curTx.txType === 'credit') {
    return actual - proposed;
  } else {
    return proposed - actual;
  }
}

export class BankMonthlyLog {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  account: Accounts;
  creditBalance = 0.0;
  bfBalance = 0.0;
  balance = 0.0;
  debitBalance = 0.0;
  diff = 0.0;
  month: string;
  year: number;
  closed = false;
  reOpened = false;
}

