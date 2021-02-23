import {FileStorage} from "./file.reader";

export class User {
  id?: number;
  companyName?: string;
  adminVerified?: boolean;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status?: boolean;
  roles?: Roles[];
  lastPwdChange?: Date;
  lastPwd?: string;
  rolesModel?: Roles[];
  role?: string;
  name: string;
  profileStatus?: boolean;
  passport?: FileStorage;
  contactEmail?: string;
}

export class ChangePassword {
  oldPassword: string;
  password: string;
  id: number;
}

export class PasswordReset {
  id: number;
  password: string;
  username: string;
}

export class EditUser {
  id?: number;
  email: string;
  status?: boolean;
  firstName: string;
  lastName: string;
  tenants?: Tenants;
  password?: string;
  oldPassword?: string;
}

export class Roles {
  id?: number;
  role: string;
  defaultRole: boolean;
  privileges?: Privilege[];

}

export class Privilege {
  id?: number;
  module: string;
  name: string;
  hasChildren: boolean;
  children?: Privilege[];
  icon: string;
  privilege: string;
  url: string;
}

export class Tenants {
  id?: number;
  uuid: string;
  name: string;
  discriminator: string;
  address: string;
  email: string;
  phoneNo: string;
  isSuper: boolean;
  status: boolean;
  editor?: string;
  privileges: Privilege[];
    logo: FileStorage;
}

export class MailTemplates {
  id?: number;
  name: string;
  template: string;
  json: string;
  subject: string;
}

export class SmsTemplates {
  id?: number;
  name: string;
  template: string;
}

export class UserFile {
  id?: number;
  users: User;
  fileType: string;
  fileName: string;
  name: string;
  data: string;
  file: FileName[] = [];
}

export class FileName {
  file: File;
  name: string;
}

export function constructBase64Data(data: UserFile | any): string {
  return 'data:' + data.fileType + ';base64, ' + data.data;
}

export class PdfFile {
  type: string;
  file: any;
}

export function userFormData(data: User, file: FileName, id = null): FormData {
  const formData = new FormData();
  formData.append('userID', String(data.id));
  formData.append('file', file.file);
  formData.append('fileName', file.name);
  if (+id) {
    formData.append('id', id);
  }
  return formData;
}

export class Banks {
  id?: number;
  name: string;
  defaultBank?: boolean;
  address: string;
}

export class Lgas {
  id?: number;
  lgCode: string;
  name: string;
  states: States;
  stateID?: number;
}

export class States {
  id?: number;
  stateCode?: string;
  name: string;
  zones: Zones;
  zoneID: number;
}

export class Zones {
  id: number;
  name: string;
}

export class Cols {
  header: string;
  field: string;
}

export class Years {
  value: number; label: string;
}

export function setYearOpts(): Years[] {
  const minYear = 2019;
  const maxYear = new Date().getFullYear();
  const k = maxYear - minYear;
  const yearOpts: Years[] = [];
  let i;
  for (i = 0; i <= k; i++) {
    const year1: number = minYear + i;
    const year2: number = minYear + i + 1;
    yearOpts.push({value: year1, label: year1 + '/' + year2});
  }

  return yearOpts;
}

export function getYears() {
  return [2019, 2020];
}

export function getYearMonths(): string[] {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
}

export class SettingEntity {
  id?: number;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  curYear: number;
  yearClosed: Date;
  curTerm?: number;
  curMonth: string;
  monthInt?: number;
}

export function setMonthRange(data: SettingEntity) {
  const months: string[] = getYearMonths();
  const resp: string[] = [];
  const curIdx = months.indexOf(data.curMonth);

  if (curIdx > -1) {
    if (curIdx === 0) {
      resp.push(months[10] + ', ' + (data.curYear - 1));
      resp.push(months[11] + ', ' + (data.curYear - 1));
      resp.push(months[0] + ', ' + (data.curYear));
      resp.push(months[1] + ', ' + (data.curYear));
      resp.push(months[2] + ', ' + (data.curYear));
    } else if (curIdx === 1) {
      resp.push(months[11] + ', ' + (data.curYear - 1));
      resp.push(months[0] + ', ' + data.curYear);
      resp.push(months[1] + ', ' + (data.curYear));
      resp.push(months[2] + ', ' + data.curYear);
      resp.push(months[3] + ', ' + data.curYear);
    } else {
      resp.push(months[curIdx - 2] + ', ' + data.curYear);
      resp.push(months[curIdx - 1] + ', ' + data.curYear);
      resp.push(months[curIdx] + ', ' + data.curYear);
      resp.push(months[curIdx + 1] + ', ' + data.curYear);
      resp.push(months[curIdx + 2] + ', ' + data.curYear);
    }
  }

  return resp;
}


