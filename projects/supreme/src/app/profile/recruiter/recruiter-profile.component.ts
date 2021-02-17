import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {User} from "../../admin/users.model";
import {FileStorage} from "../../storage/storage.model";
import {DataService} from "../../service/data.service";
import {UsersService} from "../../admin/users.service";
import {first} from "rxjs/operators";
import {MessageService} from "primeng/api";
import {ProfileService} from "../profile.service";


@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.scss']
})
export class RecruiterProfileComponent implements OnInit {
  profileGroup: FormGroup;
  accountForm: FormGroup;
  submitted = false;
  ckEditor = DecoupledEditor;
  editorConfig: any;
  loginUser: User;
  dataLoaded = false;

  @Input() passport: FileStorage[];
  @Input() logo: FileStorage[];
  @Input() user: User;
  @Output() editedUser = new EventEmitter<User>();
  @Output() editedProfile = new EventEmitter<any>();
  @Output() closed = new EventEmitter<boolean>();
  @Input() profile: any;
  @Input() enableClose: boolean = false;


  get f() { return this.profileGroup.controls; }
  get a() { return this.accountForm.controls; }

  constructor(private formBuilder: FormBuilder,
              private http: ProfileService,
              private dataStore: DataService,
              private messageService: MessageService,
              private userService: UsersService) {
    this.editorConfig = {
      removePlugins: '',
      toolbar: ['heading', '|', 'fontSize', 'fontFamily', '|', 'bold', 'italic', 'underline', 'highlight', '|',
        'alignment', '|', 'link', 'bulletedList', 'numberedList',],
      placeholder: 'Brief Company description!'
    };
  }

  ngOnInit(): void {
    this.loginUser = this.dataStore.getUser();

    this.accountForm = this.formBuilder.group({
      firstName: [this.loginUser.firstName, Validators.required],
      lastName: [this.loginUser.lastName, Validators.required],
      contactEmail: [this.loginUser.contactEmail, Validators.required],
      passport: [this.loginUser.passport, Validators.required],
    });

    if (!this.profile) {
      this.http.getMyProfile().pipe(first()).subscribe(res => {
        this.init(res);
      }, error => { this.init({})});
    } else {
      this.init(this.profile);
    }
  }

  private init(data) {
    this.profileGroup = this.formBuilder.group({
      logo: [data.logo, Validators.required],
      companyName: [data.companyName, Validators.required],
      website: [data.website, Validators.required],
      email: [data.email, Validators.required],
      city: [data.city, Validators.required],
      country: [data.country, Validators.required],
      industry: [data.industry, Validators.required],
      description: [data.about, Validators.required],
      address: [data.address, Validators.required],

    });

    if (!this.passport) {
      const fs = this.user ? this.user.passport?.id ? this.user.passport : new FileStorage()
          : this.loginUser ? this.loginUser.passport?.id ? this.loginUser.passport : new FileStorage() : new FileStorage();
      fs.tag = 'passport';
      fs.objID = this.user ? this.user.id : this.loginUser.id;
      this.passport = [fs];
    }

    if (!this.logo) {
      let fs: FileStorage = new FileStorage();
      if (this.profile && this.profile.logo) {
        fs = this.profile.logo;
      }

      fs.tag = 'logo';
      fs.objID = this.profile ? this.profile.id : 0;
      this.logo = [fs];
    }

    this.dataLoaded = true;
  }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

  submitProfile() {
    this.profileGroup.updateValueAndValidity();
    if (this.profileGroup.invalid) {
      this.submitted = true;
      return;
    }

    const profile = this.profileGroup.value;
    profile.user = this.user ? this.user : this.loginUser;
    if (this.profile) {
      const data = {...this.profile, ...profile};

      this.http.editRecruiters(data).pipe(first()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Profile Information updated successfully'
        });

        this.editedProfile.emit(res);
      })
    } else {
      this.http.saveRecruiters(profile).pipe(first()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Profile Information saved successfully'
        });

        this.editedProfile.emit(res);
      })
    }
  }


  updatePassport(event: FileStorage) {
    this.accountForm.controls.passport.setValue(event);
    this.passport = [event];
  }

  updateLogo(event: FileStorage) {
    this.profileGroup.controls.logo.setValue(event);
    this.logo = [event];
  }

  submitAccount() {
    this.accountForm.updateValueAndValidity();
    if (this.accountForm.invalid) {
      this.submitted = true;
      return;
    }

    const user = this.user ? this.user : this.loginUser;
    user.firstName = this.accountForm.controls.firstName.value;
    user.lastName = this.accountForm.controls.lastName.value;
    user.contactEmail = this.accountForm.controls.contactEmail.value;
    user.passport = this.passport[0];

    if (this.user) {
      this.userService.editUser(user).pipe(first()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Account Information updated successfully'
        });

        this.editedUser.emit(res);
      })
    } else {
      this.userService.editUser(user).pipe(first()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Account Information updated successfully'
        });
      })
    }
  }

  close() {
    this.closed.emit(true);
  }
}
