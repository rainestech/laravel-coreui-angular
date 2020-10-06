import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cols, MailTemplates} from '../../admin/users.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {first} from 'rxjs/operators';
import {NotificationService} from '../notification.service';
import {MessageService} from 'primeng/api';

declare module unlayer {
  function init(object);

  function addEventListener(event: string, f: any);

  function loadDesign(parse: any);

  function exportHtml(param: (data) => void);

  function loadBlank(param: any);

  function loadTemplate(param: any);
}

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html'
})
export class TemplatesComponent implements OnInit {
  view = 1;
  dataSetCols: Cols[] = [];
  dataSet: MailTemplates[] = [];
  dataLoaded = false;
  addEditForm: FormGroup;
  submitted = false;
  templates: string[] = [];
  @Input() projectId = 4667;
  @Input() templateId = 12749;
  saveModal: BsModalRef;
  curData: MailTemplates = new MailTemplates();
  private unlayerScript: HTMLScriptElement;

  constructor(private http: NotificationService,
              private modalService: BsModalService,
              private messageService: MessageService,
              private formBuilder: FormBuilder) {
  }

  get f() {
    return this.addEditForm.controls;
  }

  refresh() {
    this.http.getMailTemplates().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  add() {
    unlayer.loadTemplate(this.templateId);
    this.view = 2;
  }

  edit(data: MailTemplates) {
    this.curData = data;
    unlayer.loadDesign(JSON.parse(data.json));
    this.view = 2;
  }

  ngOnInit(): void {
    this.initEditor();
    this.dataSetCols = [
      {field: 'name', header: 'Name'},
      {field: 'subject', header: 'Subject'},
    ];
    this.refresh();
  }

  saveSnippet(saveTemp: TemplateRef<any>) {
    this.addEditForm = this.formBuilder.group({
      id: [this.curData.id],
      subject: [this.curData.subject, Validators.required],
      name: [this.curData.name, Validators.required],
    });

    this.saveModal = this.modalService.show(saveTemp);
  }

  close() {
    this.view = 1;
  }

  submitTemplate() {
    const template: MailTemplates = this.addEditForm.value;
    unlayer.exportHtml((data) => {
      template.json = JSON.stringify(data.design); // design json
      template.template = data.html; // final html
      this.saveModal.hide();

      if (this.curData.id) {
        return this.put(template);
      }

      // Do something with the json and html
      this.http.saveMailTemplate(template).pipe(first()).subscribe(
        res => {
          this.dataSet.push(res);
          this.close();
          this.messageService.add({
            severity: 'success', summary: 'Save Success',
            detail: res.name + ' Template Saved Successfully!'
          });
        }
      );
    });
  }

  put(data: MailTemplates) {
    this.http.updateMailTemplate(data).pipe(first()).subscribe(res => {
      const oldDataset = this.dataSet;
      oldDataset[this.dataSet.indexOf(this.curData)] = res;
      this.dataSet = oldDataset;
      this.close();

      this.messageService.add({
        severity: 'success', summary: 'Update Success',
        detail: res.name + ' Mail Template Updated Successfully!'
      });
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
}
