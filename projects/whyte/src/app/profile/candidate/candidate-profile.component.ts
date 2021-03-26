import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../admin/users.model";
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {ProfileService} from "../profile.service";
import {DataService} from "../../service/data.service";
import {MessageService} from "primeng/api";
import {UsersService} from "../../admin/users.service";
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {FileStorage} from "../../storage/storage.model";


@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {
  dataLoaded = false;
  // accountForm: FormGroup;
  submitted = false;
  profileGroup: FormGroup;
  editorConfig: any;
  ckEditor = DecoupledEditor;
  loginUser: User;
  skillSets = [];
  skills: string[] = [];

  // get a() { return this.accountForm.controls; }
  get f() { return this.profileGroup.controls; }

  @Input() passport: FileStorage[];
  @Input() user: User;
  @Output() editedUser = new EventEmitter<User>();
  @Output() editedProfile = new EventEmitter<any>();
  @Output() closed = new EventEmitter<boolean>();
  @Input() profile: any;
  @Input() enableClose: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private http: ProfileService,
              private dataStore: DataService,
              private messageService: MessageService,
              private userService: UsersService) {
    this.editorConfig = {
      removePlugins: ['Title'],
      toolbar: ['heading', '|', 'fontSize', 'fontFamily', '|', 'bold', 'italic', 'underline', 'highlight', '|',
        'alignment', '|', 'link', 'bulletedList', 'numberedList',],
      placeholder: 'About me...'
    };
  }

  ngOnInit(): void {
    this.loginUser = this.dataStore.getUser();

    if (!this.profile) {
      this.user = this.loginUser;
      this.http.getMyProfile().pipe(first()).subscribe(res => {
        this.init(res);
      }, error => { this.init({})});
    } else {
      this.init(this.profile);
    }
  }

  submitProfile() {
    this.profileGroup.updateValueAndValidity();
    if (this.profileGroup.invalid) {
      this.submitted = true;
      return;
    }

    const profile = this.profileGroup.value;
    profile.user = this.user;

    if (this.profile.id) {
      const data = {...this.profile, ...profile};

      this.http.editCandidates(data).pipe(first()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Profile Information updated successfully'
        });

        this.editedProfile.emit(res);
        if (this.enableClose) {
          this.close();
        } else {
          this.router.navigate(['/profile']);
        }
      })
    } else {
      this.http.saveCandidates(profile).pipe(first()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Profile Information saved successfully'
        });

        this.editedProfile.emit(res);
        if (this.enableClose) {
          this.close();
        } else {
          this.router.navigate(['/profile']);
        }
      })
    }
  }


  private init(data) {
    this.profileGroup = this.formBuilder.group({
      title: [data.title, Validators.required],
      description: [data.description, Validators.required],
      name: [data.name, Validators.required],
    });

    if (!this.passport) {
      const fs = this.user ? this.user.passport?.id ? this.user.passport : new FileStorage()
          : this.loginUser ? this.loginUser.passport?.id ? this.loginUser.passport : new FileStorage() : new FileStorage();
      fs.tag = 'passport';
      fs.objID = this.user ? this.user.id : this.loginUser.id;
      this.passport = [fs];
    }
    this.dataLoaded = true;
  }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

  updatePassport(event: FileStorage) {
    this.passport = [event];
    this.user.passport = event;

    if (this.loginUser.id === this.user.id) {
      this.dataStore.setUser(this.user);
    }
  }

  close() {
    this.closed.emit(true);
  }
}
