import {Lgas, States, User} from '../admin/users.model';
import {Status} from 'tslint/lib/runner';

export class Personnel {
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
  bank: PersonnelAccount;
  nok: NextOfKin;
}

export class Occupation {
  id?: number;
  personnel: Personnel;
  name: string;
  fileNo: string;
  sector: string;
  type: string;
  email: string;
  phoneNo: string;
  address: string;
  website: string;
  startDate: Date;
  endDate: Date;
  editor?: User;
  createdAt: Date;
  rank: string;
}

export class NextOfKin {
  id?: number;
  personnel: Personnel;
  firstName: string;
  lastName: string;
  otherNames: string;
  email: string;
  phoneNo: string;
  address: string;
  relationship: string;
  name: string;
  homeAddress: string;
  dob: Date;
  editor?: User;
}

export class PersonnelAccount {
  id?: number;
  personnel: Personnel;
  name: string;
  accountNo: string;
  address: string;
  bvn: string;
  editor?: User;
}

