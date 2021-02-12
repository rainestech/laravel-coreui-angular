import {User} from './users.model';

export class FileStorage {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  users: User;
  name: string;
  tag: string;
  fileType: string;
  link: string;
  storageType: string;
  file: File;
  objID: number;
}

export async function readFiles(files: File[]): Promise<FileProperties[]> {
  const res: FileProperties[] = [];
  for (const f of files) {
    res.push(await readFile(f));
  }

  return res.filter(r => r !== null);
}

export function readFile(file: File): Promise<FileProperties> {
  const res = new FileProperties();
  return new Promise<FileProperties>((s, e) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', l => {
      res.size = file.size;
      res.type = file.type;
      res.name = file.name;
      res.file = l.target.result;
      res.raw = file;
      s(res);
    });
    reader.addEventListener('error', e);
    reader.readAsDataURL(file);
  });
}

export class FileProperties {
  name: string;
  type: string;
  size: number;
  file: any;
  raw: File;
}

export function fileToFormData(file: FileProperties, docID = 0): FormData {
  const res = new FormData();
  if (file.name) {
    res.append('size', '' + file.size);
    res.append('type', file.type);
    res.append('fileType', file.type);
    res.append('name', file.name);
    res.append('file', file.raw);
    res.append('docID', '' + docID);
  }

  return res;
}

export function fileStorageToFormData(file: FileProperties, fileStorage: FileStorage): FormData {
  const res = new FormData();
  if (file.name) {
    res.append('size', '' + file.size);
    res.append('fileType', file.type);
    res.append('name', file.name);
    res.append('file', file.raw);
    res.append('objID', '' + fileStorage.objID);
    res.append('tag', fileStorage.tag);

    if (fileStorage.id) {
      res.append('id', '' + fileStorage.id);
    }
  }

  return res;
}

export function filesToFormData(files: FileProperties[], docID: number): FormData[] {
  const res: FormData[] = [];

  for (const f of files) {
    res.push(fileToFormData(f, docID));
  }

  return res.filter(r => r.get('file'));
}

