import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Channel, priorityOptions, Tasks} from "../tasks.model";
import {User} from "../../admin/users.model";
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {ChannelService} from "../../channels/channel.service";
import {MessageService} from "primeng/api";
import {first} from "rxjs/operators";


@Component({
  selector: 'app-tasks-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  dataLoaded = true;
  priorityOptions = priorityOptions;
  @Input() task: Tasks;
  @Input() channel: Channel;
  @Output() outClose = new EventEmitter<boolean>();
  @Output() outTask = new EventEmitter<Tasks>();
  taskForm: FormGroup;
  submit = false;
  channelUsers: User[];
  ckEditor = DecoupledEditor;
  editorConfig: any;

  get f() {return this.taskForm.controls; }

  constructor(private formBuilder: FormBuilder,
              private http: ChannelService,
              private messageService: MessageService) {
    this.editorConfig = {
      removePlugins: ['Title'],
      // plugins: [ Image ],
      toolbar: ['heading', '|', 'fontSize', 'fontFamily', '|', 'bold', 'italic', 'underline', 'strikethrough', 'highlight', 'fontColor',
        'fontBackgroundColor', '|', 'alignment', '|', 'numberedList', 'bulletedList', 'todoList', '|', 'indent', 'outdent', 'pageBreak',
        '|', 'link', 'blockQuote', 'imageUpload', 'insertTable', 'mediaEmbed', '|', 'undo', 'redo'],
      image: {
        toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
        styles: ['full', 'alignLeft', 'alignRight']
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells'
        ]
      },
    };
  }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: [this.task.name, Validators.required],
      taskNo: [this.task.taskNo, Validators.required],
      description: [this.task.description, Validators.required],
      priority: [this.task.priority, Validators.required],
      // parentId: [''],
      // file: [''],
      assignedTo: [this.task.assignedTo.map(a => a.id), Validators.required],
      dueDate: [new Date(), Validators.required]
    });

    this.channelUsers = this.channel.members;
  }

  close() {
    this.outClose.emit(true)
  }

  saveEdit() {
    this.submit = true;
    this.taskForm.updateValueAndValidity();
    if (this.taskForm.invalid) { return; }

    const data = this.taskForm.value;
    data.channel = this.channel;
    const u: User[] = [];
    data.tab = this.task.tab;
    data.id = this.task.id;

    data.assignedTo.forEach(a => {
      u.push(this.channelUsers.find(c => c.id === +a));
    });

    data.assignedTo = u;

    this.http.updateTask(data).pipe(first()).subscribe(res => {
      this.outTask.emit(res);
      this.messageService.add({
        severity: 'success',
        summary: 'Task information updated successfully.'
      });

      this.outClose.emit(true);
    })

  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }
}
