import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {User} from "../admin/users.model";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  incoming: any[];
  done: any[];
  progress: any[];
  resolved: any[];
  modalRef: BsModalRef;
  dataLoaded = false;
  priorityOptions = [
    {name: 'Low', class: 'info'},
    {name: 'Moderate', class: 'warning'},
    {name: 'High (Urgent)', class: 'danger'},
  ];
  searchForm: FormGroup;
  loginUser: User;
  curDoc: any;
  private allItems: any[] = [];

  constructor(
      private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({s: ['']});
    // this.loginUser = this.dataStore.getUser();
    // this.initSearch();
    this.refresh();
  }

  drop(event: CdkDragDrop<any[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // const block = event.container.id;
      // this.persistSort(this[block], block);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);

      // const block = event.container.id;
      // this.persistSort(this[block], block);
      //
      // const pBlock = event.previousContainer.id;
      // this.persistSort(this[pBlock], pBlock);
    }
    // this.allItems = [...this.incoming, ...this.done, ...this.progress];
  }

  getPassport(a) {

  }

  changePriority(a, p: any) {

  }

  docDetail(a, modal) {
  }

  refresh() {
    this.dataLoaded = false;
    const res = [
      {title: 'Frontend Development', priority: 'low'},
      {title: 'Backend Development', priority: 'high'},
      {title: 'Project Meeting', priority: 'medium'},
    ];
    this.allItems = res;
    this.placeItems(res);
    this.dataLoaded = true;
  }

  close(event: boolean) {
    if (event) {
      this.modalRef.hide();
    }
  }

  private placeItems(items: any[]) {
    this.incoming = items;
    this.progress = [items[0]];
    this.done = [items[1]];
  }

}
