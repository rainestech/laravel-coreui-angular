import {BehaviorSubject, Observable} from 'rxjs';

export class StorageDataService {
  private currentSubjects: BehaviorSubject<StorageData[]> = new BehaviorSubject<StorageData[]>([]);
  public currentData: Observable<StorageData[]> = this.currentSubjects.asObservable();

  constructor() {
  }

  setData(storageData: StorageData) {
    const cur = this.currentSubjects.getValue();
    cur.push(storageData);
    this.currentSubjects.next(cur);
  }
}

export class StorageData {
  tag: string;
  upload: boolean;
  objID: number;
}
