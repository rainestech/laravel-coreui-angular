import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {User} from "../admin/users.model";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {DataService} from "../service/data.service";
import {Channel, priorityOptions, Tasks, TaskSort} from "./tasks.model";
import {ChannelService} from "../channels/channel.service";
import {first} from "rxjs/operators";
import {MessageService} from "primeng/api";
import {Endpoints} from "../endpoints";

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
  selChannel: Channel;
  priorityOptions = priorityOptions;
  searchForm = new FormControl('');
  loginUser: User;
  channelUsers: User[] = [];
  curTask: Tasks;
  allItems: any[] = [];
  channel = new FormControl('', Validators.required);
  channelOpts: Channel[] = [];
  taskForm: FormGroup;
  submit = false;
  fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/';
  view = 1;
  get f() { return this.taskForm.controls; }

  constructor(
      private dataService: DataService,
      private http: ChannelService,
      private modalService: BsModalService,
      private messageService: MessageService,
      private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      taskNo: ['TASK-', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      // parentId: [''],
      // file: [''],
      assignedTo: [''],
      dueDate: [new Date(), Validators.required]
    });
    
    this.channel.valueChanges.subscribe(value => {
      this.selChannel = this.channelOpts.find(c => c.id === +value);
      this.getAllItems();
    });
    
    this.http.getMyChannels().pipe(first()).subscribe(res => {
      this.channelOpts = res;
      if (res.length === 1) {
        this.channel.setValue(res[0].id);
        this.selChannel = res[0];
        this.getAllItems();
      }
      this.dataLoaded = true;
    });

    this.searchForm.valueChanges.subscribe(res => {
      if (!res || res.length < 1) {
        this.placeItems(this.allItems);
      } else {
        this.placeItems(this.allItems.filter(i => i.name.toLowerCase().includes(res.toLowerCase()) || i.taskNo.toLowerCase().includes(res.toLowerCase())));
      }
    });
  }

  drop(event: CdkDragDrop<any[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const block = event.container.id;
      this.persistSort(this[block], block);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);

      const block = event.container.id;
      this.persistSort(this[block], block);

      const pBlock = event.previousContainer.id;
      this.persistSort(this[pBlock], pBlock);
    }
    this.allItems = [...this.incoming, ...this.done, ...this.progress];
  }

  changePriority(a, p: any) {

  }

  docDetail(a) {
    this.curTask = a;
    this.view = 2;
  }

  addTask(modal) {
    const selChannel = this.channelOpts.find(c => +this.channel.value === c.id);
    this.channelUsers = selChannel.members;
    this.modalRef = this.modalService.show(modal);
  }

  refresh() {
    if (this.channel.invalid) { return; }
    this.dataLoaded = false;
    this.getAllItems();
  }

  close(event: boolean) {
    if (event) {
      this.modalRef.hide();
      this.view = 1;
    }
  }

  private getAllItems() {
    if (!this.selChannel) { return; }
    this.http.getTaskByChannel(this.selChannel.id).pipe(first()).subscribe(res => {
      this.allItems = res;
      this.placeItems(res);
      this.dataLoaded = true;
    });
  }

  private placeItems(items: Tasks[]) {
    this.done = items.filter(r => r.tab.toLowerCase() === 'done');
    this.progress = items.filter(r => r.tab.toLowerCase() === 'progress');
    this.incoming = items.filter(r => r.tab.toLowerCase() === 'todo' || r.tab.toLowerCase() === 'incoming');
  }
  newTask() {
    this.taskForm.updateValueAndValidity();
    if (this.taskForm.invalid) { return; }

    const assignees: User[] = [];
    const data: Tasks = this.taskForm.value;
    data.tab = 'todo';
    data.assignedTo.forEach(u => {
      // @ts-ignore
      assignees.push(this.selChannel.members.find(m => m.id === u));
    });
    data.assignedTo = assignees;
    data.channel = this.selChannel;

    this.http.saveTask(data).pipe(first()).subscribe(res => {
      this.incoming = [res, ...this.incoming];
      this.allItems = [...this.allItems, res];

      this.modalRef.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'Task added Successfully'
      })
    })
  }

  private persistSort(list: Tasks[], block: string) {
    const ls = [];
    list.forEach((v, i) => {
      const a = new TaskSort();
      a.tab = block;
      a.id = v.id;
      a.position = i;
      ls.push(a);
    });

    if (ls.length > 0) {
      this.http.saveTaskSort(ls).pipe(first()).subscribe(() => console.log('sort saved'));
    }
  }

  deleted(event: Tasks) {
    this.allItems = this.allItems.filter(i => i.id !== event.id);
    this.placeItems(this.allItems);
  }
}
