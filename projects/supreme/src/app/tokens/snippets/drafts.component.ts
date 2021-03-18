import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ConfirmationService, MessageService} from 'primeng/api';
import {first} from 'rxjs/operators';
import {Cols} from "../../admin/users.model";
import {SearchService} from "../../search/search.service";

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit {
  view = 1;
  dataLoaded = false;
  cols: Cols[] = [];
  dataSet: any[] = [];
  title = 'Add New Drafts';
  draftForm: FormGroup;
  submitted = false;
  newDraft: any;
  curDraft: any;
  ckEditor = DecoupledEditor;
  editorConfig: any;
  addEdit: BsModalRef;

  constructor(private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private http: SearchService) {
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

  get s() {
    return this.draftForm.controls;
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit() {
    this.cols = [
      {field: 'id', header: 'ID'},
      {field: 'name', header: 'Name'},
      {field: 'created_at', header: 'Date'},
      {field: 'action', header: 'Action'}
    ];
    this.refresh();
  }

  refresh() {
    this.http.getPages().pipe(first()).subscribe(res => {
      this.dataSet = [...res];
      this.dataLoaded = true;
    });
  }

  add() {
    this.draftForm = this.formBuilder.group({
      name: ['', Validators.required],
      snippet: ['', Validators.required],
    });

    this.view = 2;
  }

  edit(data: any) {
    this.curDraft = data;
    this.draftForm = this.formBuilder.group({
      id: [data.id, Validators.required],
      name: [data.name, Validators.required],
      snippet: [data.snippet, Validators.required],
    });

    this.view = 2;
  }

  del(data: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Page Draft: ' + data.title + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deletePages(data.id).pipe(first()).subscribe(
          () => {
            this.dataSet = this.dataSet.filter(f => f !== data);
            this.messageService.add({severity: 'success', summary: 'Delete Success', detail: data.name + ' Removed from Database!'});
          });
      },
      reject: () => {
        return;
      }
    });
  }

  saveDraft() {
    this.submitted = true;
    if (this.draftForm.invalid) {
      return;
    } else {
      this.newDraft = this.draftForm.value;
      if (this.newDraft.id) {
        this.put();
      } else {
        this.post();
      }
    }
  }

  close() {
    this.submitted = false;
    this.view = 1;
  }

  private put() {
    const oldDataSet = [...this.dataSet];
    this.http.saveSnippet(this.newDraft).pipe(first()).subscribe(
      data => {
        oldDataSet[this.dataSet.indexOf(this.curDraft)] = data;
        this.dataSet = oldDataSet;
        this.messageService.add({severity: 'success', summary: 'Update Success', detail: this.newDraft.title + ' Updated!'});
        this.close();
      });
  }

  private post() {
    this.http.saveSnippet(this.newDraft).pipe(first()).subscribe(res => {
      this.dataSet.push(res);
      this.messageService.add({severity: 'success', summary: 'Save Success', detail: this.newDraft.title + ' Saved Successfully!'});
      this.close();
    });
  }
}
