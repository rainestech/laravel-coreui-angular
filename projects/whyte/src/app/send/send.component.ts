import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {Cols, MailTemplates} from "../admin/users.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {SendMailService} from "./send.service";
import {first} from "rxjs/operators";
import {LmsComponent} from "../lms/lms.component";
import {LmsService} from "../lms/lms.service";
import {DataService} from "../service/data.service";

declare module unlayer {
  function init(object);

  function addEventListener(event: string, f: any);

  function loadDesign(parse: any);

  function exportHtml(param: (data) => void);

  function loadBlank(param: any);

  function loadTemplate(param: any);
}

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
    view = 1;
  dataLoaded = false;
  dataSetCols: Cols[] = [];
  dataSet: any[] = [];
  saveModal: BsModalRef;
  addEditForm: FormGroup;
  @Input() projectId = 4667;
  @Input() templateId = 47821;
  private unlayerScript: HTMLScriptElement;
  curData: any = {};
  name = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  customEmails: any[] = [];
  enterCustom = false;
  private users: any[] = [];
  private allUsers: any[] = [];
  private pingUuid;


  get f() { return this.addEditForm.controls; }

  constructor(private http: SendMailService,
              private confirmService: ConfirmationService,
              private lms: LmsService,
              private dataStore: DataService,
              private modalService: BsModalService,
              private messageService: MessageService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initEditor();
    this.dataSetCols = [
      {field: 'subject', header: 'Subject'},
      {field: 'status', header: 'Status'},
      {field: 'sentTo', header: 'Sent To'},
      {field: 'totalOpen', header: 'Stats'},
    ];
    // this.pingUuid = this.dataStore.getLmsToken();
    this.refresh();
    this.lms.proxyUsers().pipe(first()).subscribe(res => {
      this.users = this.allUsers = res;
    });
  }

  protected initEditor() {
    const unlayerScript = this.unlayerScript = document.createElement('script');
    unlayerScript.setAttribute('src', '//editor.unlayer.com/embed.js');
    unlayerScript.onload = () => {
      this.loadEditor();
    };

    document.head.appendChild(unlayerScript);
  }

  protected loadEditor() {
    unlayer.init({
      id: 'editor',
      projectId: this.projectId,
      templateId: this.templateId,
      displayMode: 'email',
    });

    unlayer.addEventListener('design:loaded', function (data) {
      console.log('unlayer loaded');
    });
  }

  refresh() {
    this.http.getMails().pipe(first()).subscribe(res => {
      this.dataSet = res;
      this.dataLoaded = true;
    });
  }

  newEmail() {
    unlayer.loadTemplate(this.templateId);
    this.view = 2;
  }

  edit(data) {
    this.curData = data;
    unlayer.loadDesign(JSON.parse(data.json));
    this.view = 2;
  }

  put(data: MailTemplates) {
    this.http.editMail(data).pipe(first()).subscribe(res => {
      const oldDataset = this.dataSet;
      oldDataset[this.dataSet.indexOf(this.curData)] = res;
      this.dataSet = oldDataset;
      this.close();

      this.messageService.add({
        severity: 'success', summary: 'Update Success',
        detail: res.name + ' Mail Updated Successfully!'
      });
    });
  }

  delete(data) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete Mail?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deleteMail(data).pipe(first()).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Success', detail: 'Channel Removed from Platform!'
              });
              this.dataSet = this.dataSet.filter(d => d.id !== data.id);
            });
      },
      reject: () => {
        return;
      }
    });
  }

  close() {
    this.view = 1;
  }

  saveSnippet(saveTemp: TemplateRef<any>) {
    this.addEditForm = this.formBuilder.group({
      id: [this.curData.id],
      subject: [this.curData.subject, Validators.required],
      sentTo: [this.curData.sentTo, Validators.required],
    });

    this.addEditForm.controls.sentTo.valueChanges.subscribe(value => {
      this.enterCustom = value === 'custom';
      this.customEmails = [];
      if (value === 'active') {
        this.users = this.allUsers.filter(u => u.status === 'active');
        this.addEmail(this.users);
      } else if (value === 'changed') {
        this.users = this.allUsers.filter(u => u.status === 'changed');
        this.addEmail(this.users);
      } else if (value === 'expired') {
        this.users = this.allUsers.filter(u => u.status === 'expired');
        this.addEmail(this.users);
      } else if (value === 'month') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => new Date(u.endDate).getMonth() === nw.getMonth() && new Date(u.endDate).getFullYear() === nw.getFullYear() && u.status === 'active');
        this.addEmail(this.users);
      } else if (value === 'week') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => LmsComponent.getDateDiff(new Date(u.endDate), nw) <= 7 && u.status === 'active');
        this.addEmail(this.users);
      } else if (value === 'today') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => new Date(u.endDate).getFullYear() === nw.getFullYear() && new Date(u.endDate).getMonth() === nw.getMonth() && new Date(u.endDate).getDate() === nw.getDate() && u.status === 'active');
        this.addEmail(this.users);
      } else if (value === 'inactive') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => u.status === 'inactive');
        this.addEmail(this.users);
      } else if (value === 'cancelled') {
        const nw = new Date();
        this.users = this.allUsers.filter(u => u.status.includes('cancel'));
        this.addEmail(this.users);
      }
    });

    this.saveModal = this.modalService.show(saveTemp);
  }


  sendEmail(mode: number = 1) {
    const template: any = this.addEditForm.value;
    unlayer.exportHtml((data) => {
      template.json = JSON.stringify(data.design); // design json
      template.template = data.html; // final html
      template.toValues = this.customEmails;
      template.status = mode === 1 ? 'draft' : 'send';
      this.saveModal.hide();

      if (this.curData.id) {
        return this.put(template);
      }

      // Do something with the json and html
      this.http.saveEmail(template).pipe(first()).subscribe(
          res => {
            this.dataSet.push(res);
            this.close();
            this.messageService.add({
              severity: 'success', summary: 'Email Processed',
              detail: res.subject + res.status === 'sent' ? ' Sent Successfully!' : ' Saved Successfully'
            });
          }, () => {
            this.messageService.add({
              severity: 'error', summary: 'Email Error',
              detail: 'Could Not Process Email at this time due to an unknown error!'
            });
          }
      );
    });
  }

  addEmail(users: any[] = null) {
    if (!users) {
      const data = {
        "name": this.name.value,
        "email": this.email.value,
      };

      this.customEmails.push(data);
      this.name.reset('');
      this.email.reset('');
    } else {
      this.customEmails = users.map(u => ({"name": u.name, "email": u.email }));
    }

    console.log(this.customEmails);
  }

  removeEmail(addr: any) {
    this.customEmails = this.customEmails.filter(e => e !== addr);
  }
}
