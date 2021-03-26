import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FullCalendar} from "primeng/fullcalendar";
import {ChannelService} from "../channels/channel.service";
import {first} from "rxjs/operators";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Comments, dateAsYYYYMMDD, validateFile} from "../tasks/tasks.model";
import {ConfirmationService, MessageService} from "primeng/api";
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {Endpoints} from "../endpoints";
import {User} from "../admin/users.model";
import {DataService} from "../service/data.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {fileStorageToFormData, readFile} from "../../../../../src/app/admin/file.reader";
import {FileProperties} from "../admin/file.reader";

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {
  channel = new FormControl('', Validators.required);
  selChannel: any;
  channelOpts: any[] = [];
  events: any[] = [];
  options: any;
  dataLoaded = false;
  uploadModal: BsModalRef;
  dataSet: any[] = [];
  @ViewChild('calendar') private calendar: FullCalendar;
  selEvent: any;
  view = 1;
  eventForm: FormGroup;
  submitted = false;
  ckEditor = DecoupledEditor;
  editorConfig: any;
  fsPath = Endpoints.mainUrl + Endpoints.fsDL + '/';
  loginUser: User;
  comment = new FormControl('', Validators.required);
  pendingUpload: FileProperties;
  error: any;
  fileError: string;
  uploadResponse = { status: '', message: '', filePath: '' };
  uploading: boolean;
  token: string;


  get f() { return this.eventForm.controls; }

  constructor(private http: ChannelService,
              private formBuilder: FormBuilder,
              private dataService: DataService,
              private modalService: BsModalService,
              private confirmService: ConfirmationService,
              private messageService: MessageService) {
    this.editorConfig = {
      removePlugins: ['Title'],
      // plugins: [ Image ],
      toolbar: {
        items: [
          'heading',
          '|',
          'fontSize',
          'fontFamily',
          '|',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'alignment',
          '|',
          'numberedList',
          'bulletedList',
          '|',
          'outdent',
          'indent',
          '|',
          'todoList',
          'link',
          'blockQuote',
          'imageUpload',
          'insertTable',
          'codeBlock',
          '|',
          'undo',
          'redo'
        ]
      },
      language: 'en',
      image: {
        toolbar: [
          'imageTextAlternative',
          'imageStyle:full',
          'imageStyle:side'
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties'
        ]
      },
    };
  }

  ngOnInit(): void {
    this.loginUser = this.dataService.getUser();
    this.token = this.dataService.getToken();
    this.channel.valueChanges.subscribe(value => {
      this.selChannel = this.channelOpts.find(c => c.id === +value);
      this.refresh();
    });

    this.http.getMyChannels().pipe(first()).subscribe(res => {
      this.channelOpts = res;
      if (res.length === 1) {
        this.channel.setValue(res[0].id);
        this.selChannel = res[0];
        this.refresh();
      }
    });

  }

  initCalendarOptions(data: any[]) {
    this.options = {
      initialView: 'dayGridMonth',
      dateClick: this.handleDateClick.bind(this), // bind is important!
      eventClick: this.handleEventClick.bind(this),
      events: [
        { title: 'event 1', date: '2021-02-01' },
        { title: 'event 2', date: '2021-02-02' }
      ]
    };
     const events = [];
    data.forEach(d => {
      const eDate = dateAsYYYYMMDD(new Date(d.calDate));
      events.push({title: d.name, date: eDate, id: d.id})
    });

    this.options.events = events;
    this.dataLoaded = true;
  }

  handleDateClick(arg) {
    this.confirmService.confirm({
      message: 'Do you want to add new event?',
      header: 'New Event Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (arg.date.getTime() < (new Date().setHours(1)) && dateAsYYYYMMDD(arg.date) !== dateAsYYYYMMDD(new Date())) {
          this.messageService.add({
            severity: 'error',
            summary: 'New Schedules must always be in the future'
          });

          return;
        }
        const data = {calDate: arg.date, channel: this.selChannel};
        this.initForm(data)
      },
      reject: () => {
        return;
      }
    });
  }

  handleEventClick(arg) {
    // console.log(arg.event._def);
    this.selEvent = this.dataSet.find(c => +c.id === +arg.event._def.publicId);
    // console.log(this.selEvent);
    // console.log(+arg.event._def.publicId);
  }

  refresh() {
    if (!this.selChannel) {
      return;
    }
    this.http.getCalendar(this.selChannel.id).pipe(first()).subscribe(res => {
      this.initCalendarOptions(res);
      this.dataSet = res;
    })
  }

  initForm(data = null) {
    if(!data) {
      data = {};
    }

    this.eventForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      calDate: [data.calDate, Validators.required],
      channel: [data.channel, Validators.required],
    });

    this.view = 2;
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

  saveSchedule() {
    this.eventForm.updateValueAndValidity();
    this.submitted = true;

    if (this.eventForm.invalid) {
      return;
    }

    let data = this.eventForm.value;
    data.channel = this.selChannel;
    if (data.calDate instanceof Date) {
      data.calDate = new Date(data.calDate.setDate(data.calDate.getDate() + 1));
    }

    if (this.selEvent) {
      data = {...this.selEvent, ...data};
      this.updateEvent(data);
    } else {
      this.postEvent(data);
    }
  }

  updateEvent(data: any) {
    this.http.editCalendar(data).pipe(first()).subscribe(res => {
      this.dataSet[this.dataSet.indexOf(this.selEvent)] = res;
      this.initCalendarOptions(this.dataSet);
      this.messageService.add({
        severity: 'success',
        summary: 'Schedule updated successfully'
      });

      this.view = 1;
    });
  }

  postEvent(data: any) {
    this.http.saveCalendar(data).pipe(first()).subscribe(res => {
      this.dataSet.push(res);
      this.initCalendarOptions(this.dataSet);
      this.messageService.add({
        severity: 'success',
        summary: 'Schedule saved successfully'
      });

      this.view = 1;
    });
  }

  postComment() {
    if (this.comment.invalid) { return; }

    const data: Comments = new Comments();
    data.comment = this.comment.value;
    data.schedule = this.selEvent;

    this.http.saveComments(data).pipe(first()).subscribe(res => {
      if (!this.selEvent.comments) {
        this.selEvent.comments = [];
      }
      this.selEvent.comments = [...this.selEvent.comments, res];
      this.comment.reset();
    });
  }

  deleteComment(comm: Comments) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete comment?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteComment(comm.id).pipe(first()).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: 'Comment deleted!'
              });
              this.selEvent.comments = this.selEvent.comments.filter(c => c.id !== comm.id);
            }
        );
      },
      reject: () => {
        return;
      }
    });
  }

  upload(temp: TemplateRef<any>) {
    this.fileError = '';
    this.uploadModal = this.modalService.show(temp, {backdrop: 'static', keyboard: false});
  }

  readURL(event: any, fileType: string) {
    this.fileError = '';
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const val = validateFile(file, fileType, 1024000);
      if (val !== true) {
        this.fileError = val;
        return;
      }

      readFile(file).then(e => {
        if (e.name) {
          this.pendingUpload = e;
        }
      });
    }
  }


  postFile() {
    if (this.comment.invalid) {
      return;
    }
    this.uploading = true;
    const formData = fileStorageToFormData(this.pendingUpload, { tag: 'comment', objID: 0});
    this.http.saveFile(formData).pipe(first()).subscribe(res => {
      this.uploadResponse = res;

      const data: Comments = new Comments();
      data.comment = this.comment.value;
      data.schedule = this.selEvent;
      data.file = res;

      this.http.saveComments(data).pipe(first()).subscribe(res => {
        if (!this.selEvent.comments) {
          this.selEvent.comments = [];
        }
        this.selEvent.comments = [...this.selEvent.comments, res];
        this.comment.reset();
        this.uploading = true;
        this.uploadModal.hide();
      });
    });
  }


  downloadFile(docs: any) {
    // const data = Endpoints.mainUrl + '/api/v1/docs/dl/' + doc.file.link + '?token=' + this.token;
    window.open(Endpoints.mainUrl + '/api/v1/docs/dl/' + docs.link + '?token=' + encodeURIComponent(this.token),
        '_blank');

    return false;
  }
}
