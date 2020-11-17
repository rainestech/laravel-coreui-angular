import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {MatStepper} from '@angular/material/stepper';
import {Banks, Lgas, States, User} from '../../admin/users.model';
import {NextOfKin, Occupation, Personnel, PersonnelAccount} from '../emplyees.model';
import {DataService} from '../../services/data.service';
import {UsersService} from '../../admin/users.service';
import {EmployeesService} from '../employees.service';
import {FileStorage} from '../../storage/storage.model';

@Component({
  selector: 'app-employees-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  dataLoaded = false;
  bioFormGroup: FormGroup;
  nokForm: FormGroup;
  isEditable = true;
  bioSubmit = false;
  states: States[] = [];
  lgas: Lgas[] = [];
  nokSubmit = false;
  officialFormGroup: FormGroup;
  officialSubmit = false;
  formSubmit = false;
  passportForm: FormGroup;
  banks: Banks[] = [];
  @Input() user: User;
  @Input() editPersonnel: Personnel;
  @Output() personnel = new EventEmitter<Personnel>();
  upload: boolean = false;
  @Input() passport: FileStorage[];
  @Input() nokPassport: FileStorage[];
  relationship: string[] = ['Sibling', 'Daughter', 'Son', 'Cousin', 'Nephew', 'Uncle', 'Aunt', 'In-Laws', 'Spouse', 'Other'];
  private loginUser: User;
  @ViewChild('stepper', {static: false}) private myStepper: MatStepper;
  private selState: States;
  private selLga: Lgas;
  private newPersonnel: Personnel;
  private newBank: PersonnelAccount;
  private newOccupation: Occupation;
  private newNok: NextOfKin;
  private respPersonnel: Personnel;
  private respOccupation: Occupation;
  private respBank: PersonnelAccount;
  private respNok: NextOfKin;
  processing = false;
  private bioServerSubmit = false;
  private occServerSubmit = false;
  private nokServerSubmit = false;

  constructor(private _formBuilder: FormBuilder,
              private dataStore: DataService,
              private settingsService: UsersService,
              private http: EmployeesService) {
  }

  // convenience getter for easy access to form fields
  get b() {
    return this.bioFormGroup.controls;
  }

  get p() {
    return this.passportForm.controls;
  }

  get n() {
    return this.nokForm.controls;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.officialFormGroup.controls;
  }

  ngOnInit() {
    this.loginUser = this.dataStore.getUser();

    if (!this.passport) {
      const fs = this.user ? this.user.passport?.id ? this.user.passport : new FileStorage()
          : this.loginUser ? this.loginUser.passport?.id ? this.loginUser.passport : new FileStorage() : new FileStorage();
      fs.tag = 'passport';
      fs.objID = this.user ? this.user.id : this.loginUser.id;
      this.passport = [fs];
    }

    if (!this.nokPassport) {
      let fs: FileStorage = new FileStorage();
      if (this.editPersonnel && this.editPersonnel.nok) {
        fs = this.editPersonnel.nok.passport?.id ? this.editPersonnel.nok.passport : new FileStorage();
      }

      fs.tag = 'nok';
      fs.objID = this.editPersonnel?.nok ? this.editPersonnel.nok.id : 0;
      this.nokPassport = [fs];
      console.log(fs);
    }

    if (this.editPersonnel) {
      this.respPersonnel = this.editPersonnel;
      this.respBank = this.editPersonnel.bank;
      this.respOccupation = this.editPersonnel.occupation;
      this.respNok = this.editPersonnel.nok;
    }

    this.bioForm();
    this.officialForm();
    this.passportFormInit();
    this.initNokForm();
    this.formValueChanges();
    this.initVars();
  }

  submitBio() {
    this.postPersonnel();
    this.bioSubmit = true;
  }

  submitNok() {
    this.postNok();
    this.nokSubmit = true;
  }

  submitOfficial() {
    this.postOccupation();
    this.officialSubmit = true;
  }

  processForm() {
    this.formSubmit = true;
    this.processing = true;
    this.postPersonnel();
  }

  postPersonnel() {
    if (this.bioServerSubmit) {
      if (this.processing)
        return this.postOccupation();

      return;
    }

    this.newPersonnel = this.bioFormGroup.value;
    this.newPersonnel.lgas = this.selLga;
    this.newPersonnel.states = this.selState;
    this.newPersonnel.user = this.user ? this.user : this.loginUser;
    if (this.respPersonnel) {
      this.newPersonnel.id = this.respPersonnel.id;
    }
    this.http.saveEmployee(this.newPersonnel).pipe(first()).subscribe(
      data => {
        this.newPersonnel = data;
        this.bioServerSubmit = true;
        this.processing ? this.postOccupation() : null;
      }, () => this.processing = false
    );
  }

  postOccupation() {
    if (this.occServerSubmit) {
      if (this.processing) return this.postNok();

      return;
    }

    this.newOccupation = this.officialFormGroup.value;
    this.newOccupation.personnel = this.newPersonnel;
    if (this.respOccupation) {
      this.newOccupation.id = this.respOccupation.id;
    }

    this.http.saveEmpOcc(this.newOccupation).pipe(first()).subscribe(
      data => {
        this.newOccupation = data;
        this.respOccupation = data;
        this.occServerSubmit = true;
        this.processing ? this.postNok(): null;
      }, () => this.processing = false
    );
  }

  postNok() {
    if (this.nokServerSubmit) {
      if (this.processing) return this.postBank();

      return;
    }

    this.newNok = this.nokForm.value;
    this.newNok.personnel = this.newPersonnel;
    // this.newNok.passport = this.nokPassport[0];
    if (this.respNok) {
      this.newNok.id = this.respNok.id;
    }

    this.http.saveEmpNok(this.newNok).pipe(first()).subscribe(
      data => {
        this.newNok = data;
        this.respNok = data;
        this.nokServerSubmit = true;
        this.processing ? this.postBank() : null;
      }, () => this.processing = false
    );
  }

  postBank() {
    // const data: PersonnelAccount = new PersonnelAccount();
    // data.accountNo = this.passportForm.controls.accountNo.value;
    // data.name = this.passportForm.controls.name.value;
    // data.bvn = this.passportForm.controls.bvn.value;
    // data.address = this.passportForm.controls.address.value;
    this.newBank = this.passportForm.value;
    this.newBank.personnel = this.newPersonnel;
    if (this.respBank) {
      this.newBank.id = this.respBank.id;
    }

    this.http.saveEmpBank(this.newBank).pipe(first()).subscribe(
      data => {
        this.newBank = data;
        this.respBank = data;
        this.newPersonnel.occupation = this.newOccupation;
        this.newPersonnel.bank = this.newBank;
        this.newPersonnel.nok = this.newNok;
        this.personnel.emit(this.newPersonnel);
      }, () => this.processing = false
    );
  }

  private bioForm() {
    let data: Personnel = null;
    if (this.editPersonnel) {
      data = this.editPersonnel;
      this.selLga = data.lgas;
      this.selState = data.lgas.states;
      this.getLgas(this.selState);
      data.states = this.selState;
      this.respPersonnel = data;
    }

    this.bioFormGroup = this._formBuilder.group({
      lastName: [data ? data.lastName : '', Validators.required],
      firstName: [data ? data.firstName : '', Validators.required],
      otherNames: [data ? data.otherNames : ''],
      dob: [data ? new Date(data.dob) : new Date()],
      joinDate: [data ? new Date(data.joinDate) : new Date(), Validators.required],
      gender: [data ? data.gender : ''],
      nationality: [data ? data.nationality : '', Validators.required],
      states: [data ? data.states.id : '', Validators.required],
      lga: [data ? data.lgas.id : '', Validators.required],
      maritalStatus: [data ? data.maritalStatus : ''],
      homeAddress: [data ? data.homeAddress : '', Validators.required],
      address: [data ? data.address : '', Validators.required]
    });
  }

  private initNokForm() {
    let data: NextOfKin = null;
    if (this.editPersonnel) {
      data = this.editPersonnel.nok;
      this.respNok = data;
    }

    this.nokForm = this._formBuilder.group({
      lastName: [data ? data.lastName : '', Validators.required],
      firstName: [data ? data.firstName : '', Validators.required],
      otherNames: [data ? data.otherNames : ''],
      dob: [data ? new Date(data.dob) : new Date()],
      relationship: [data ? data.relationship : '', Validators.required],
      phoneNo: [data ? data.phoneNo : '', Validators.required],
      email: [data ? data.email : '', [Validators.required, Validators.email]],
      homeAddress: [data ? data.homeAddress : '', Validators.required],
      address: [data ? data.address : '', Validators.required],
      passport: [data ? data.passport : '', Validators.required],
      // id: [data ? data.id : '']
    });
  }

  private officialForm() {
    let data: Occupation = null;
    if (this.editPersonnel) {
      data = this.editPersonnel.occupation;
      this.respOccupation = data;
    }
    this.officialFormGroup = this._formBuilder.group({
      startDate: [new Date(), Validators.required],
      name: [data ? data.name : '', Validators.required],
      sector: [data ? data.sector : '', Validators.required],
      type: [data ? data.type : '', Validators.required],
      rank: [data ? data.rank : '', Validators.required],
      address: [data ? data.address : '', Validators.required],
      email: [data ? data.email : ''],
      phoneNo: [data ? data.phoneNo : ''],
      website: [data ? data.website : ''],
    });
  }

  private passportFormInit() {
    let data: PersonnelAccount = null;
    if (this.editPersonnel) {
      data = this.editPersonnel.bank;
      this.respBank = data;
    }

    const passport = this.passport[0];

    this.passportForm = this._formBuilder.group({
      name: [data ? data.name : '', Validators.required],
      address: [data ? data.address : '', Validators.required],
      accountNo: [data ? data.accountNo : '', Validators.required],
      passport: [passport ? passport : '', Validators.required],
      bvn: [data ? data.bvn : '', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    });
  }

  private formValueChanges() {
    this.bioFormGroup.valueChanges.subscribe(() => { this.bioServerSubmit = false; });
    this.officialFormGroup.valueChanges.subscribe(() => { this.occServerSubmit = false; });
    this.nokForm.valueChanges.subscribe(() => { this.occServerSubmit = false; });
    this.bioFormGroup.controls['states'].valueChanges.subscribe(
      (value) => {
        const selState = this.states.find(d => d.id === +value);
        this.selState = selState;
        if (selState) {
          this.getLgas(selState);
        }
      }
    );

    this.bioFormGroup.controls['lga'].valueChanges.subscribe(
      (value) => {
        this.selLga = this.lgas.find(d => d.id === +value);
      }
    );
  }

  private initVars() {
    forkJoin([
      this.settingsService.getStates(),
      this.settingsService.getBanks(),
    ]).pipe(map(([states, banks]) => {
      return {states, banks};
    })).subscribe(
      res => {
        this.states = [...res.states];
        this.banks = [...res.banks];
        this.dataLoaded = true;
      }
    );
  }

  private getLgas(selState: States) {
    this.settingsService.getStateLgas(selState.id).pipe(first()).subscribe(res => this.lgas = [...res]);
  }

  updateNokPassport(event: FileStorage) {
    this.nokForm.controls.passport.setValue(event);
    this.nokPassport = [event];
  }

  uploadPassport(event: FileStorage) {
    this.passportForm.controls.passport.setValue(event);
    this.passport = [event];
  }

  updatePassport() {
    return !this.user || this.user === this.loginUser;
  }
}
