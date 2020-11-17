import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
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
  genderOpts: string[] = ['Male', 'Female'];
  workFormGroup: FormGroup;
  occSubmit = false;
  nokSubmit = false;
  endOn = false;
  officialFormGroup: FormGroup;
  officialSubmit = false;
  maritalOpts: string[] = ['Single', 'Married', 'Separated', 'Divorced', 'Widowed'];
  statusOpts = ['Active', 'In-Active', 'Left', 'Suspended'];
  formSubmit = false;
  formProcessed = false;
  startDate = new Date(1950, 0, 1);
  intSubmit = false;
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

  constructor(private _formBuilder: FormBuilder,
              private dataStore: DataService,
              private settingsService: UsersService,
              private http: EmployeesService,
              private messageService: MessageService) {
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
      const fs = this.editPersonnel?.nok.passport?.id ? this.editPersonnel?.nok.passport : new FileStorage();
      fs.tag = 'nok';
      fs.objID = this.editPersonnel?.nok.id ? this.editPersonnel?.nok.id : 0;
      this.nokPassport = [fs];
    }

    if (this.editPersonnel) {
      this.respPersonnel = this.editPersonnel;
      this.respBank = this.editPersonnel.bank;
      this.respOccupation = this.editPersonnel.occupation;
    }

    this.bioForm();
    this.officialForm();
    this.passportFormInit();
    this.formValueChanges();
    this.initNokForm();
    this.initVars();
  }

  submitBio() {
    this.bioSubmit = true;
  }

  submitNok() {
    this.nokSubmit = true;
  }

  submitOfficial() {
    this.officialSubmit = true;
  }

  resetVars() {
    this.occSubmit = false;
    this.bioSubmit = false;
    this.officialSubmit = false;
    this.newPersonnel = null;
    this.officialFormGroup.reset();
    this.workFormGroup.reset();
    this.bioFormGroup.reset();
    this.myStepper.reset();
  }

  processForm() {
    this.formSubmit = true;
    this.newPersonnel = this.bioFormGroup.value;
    this.newPersonnel.lgas = this.selLga;
    this.newPersonnel.states = this.selState;
    this.newPersonnel.user = this.user ? this.user : this.loginUser;
    this.postPersonnel();
  }

  postPersonnel() {
    if (this.respPersonnel) {
      this.newPersonnel.id = this.respPersonnel.id;
    }
    this.http.saveEmployee(this.newPersonnel).pipe(first()).subscribe(
      data => {
        this.newPersonnel = data;
        this.postOccupation();
      }
    );
  }

  postOccupation() {
    this.newOccupation = this.officialFormGroup.value;
    this.newOccupation.personnel = this.newPersonnel;
    if (this.respOccupation) {
      this.newOccupation.id = this.respOccupation.id;
    }

    this.http.saveEmpOcc(this.newOccupation).pipe(first()).subscribe(
      data => {
        this.newOccupation = data;
        this.respOccupation = data;
        this.postNok();
      }
    );
  }

  postNok() {
    this.newNok = this.nokForm.value;
    this.newNok.personnel = this.newPersonnel;
    if (this.respNok) {
      this.newNok.id = this.respNok.id;
    }

    this.http.saveEmpNok(this.newNok).pipe(first()).subscribe(
      data => {
        this.newNok = data;
        this.respNok = data;
        this.postBank();
      }
    );
  }

  postBank() {
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
      }
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
      passport: [data ? data.passport : '', Validators.required]
    });
  }

  private officialForm() {
    let data: Occupation = null;
    if (this.editPersonnel) {
      data = this.editPersonnel.occupation;
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
    }

    const passport = this.passport[0].id;

    this.passportForm = this._formBuilder.group({
      name: [data ? data.name : '', Validators.required],
      address: [data ? data.address : '', Validators.required],
      accountNo: [data ? data.accountNo : '', Validators.required],
      passport: [passport ? passport : '', Validators.required],
      bvn: [data ? data.bvn : ''],
    });
  }

  private formValueChanges() {
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
  }

  uploadPassport(event: FileStorage) {
    this.passportForm.controls.passport.setValue(event);
  }

  updatePassport() {
    return this.user === undefined;
  }
}
