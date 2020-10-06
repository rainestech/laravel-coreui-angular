import {Tenants, User} from '../admin/users.model';

export class FileStorage {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  users: User;
  tenants: Tenants;

  name: string;
  tag: string;
  fileType: string;
  link: string;
  storageType: string;
  file: File;
  objID: number;
}

