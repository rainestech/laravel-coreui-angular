import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Contributions, ContributionType, getPeriodLabel} from '../contributions.model';
import {ContributionsService} from '../contributions.service';
import {first} from 'rxjs/operators';
import {Personnel} from '../../members/emplyees.model';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-contribution-add-edit',
  templateUrl: './data.component.html',
})
export class DataComponent implements OnInit {
  dataLoaded = false;
  subForm: FormGroup;
  types: ContributionType[] = [];
  submitted = false;
  @Input() contribution: Contributions;
  @Input() personnel: Personnel;
  @Output() subs = new EventEmitter<Contributions>();
  private selType: ContributionType;
  private title: string;

  constructor(private http: ContributionsService, private formBuilder: FormBuilder, private messageService: MessageService) {
  }

  get f() {
    return this.subForm.controls;
  }

  ngOnInit(): void {
    let data = this.contribution;
    if (!data) {
      data = new Contributions();
      data.personnel = this.personnel;
    } else {
      this.personnel = data.personnel;
      this.selType = data.type;
      this.title = 'Edit ' + data.personnel.name + ' Subscription';
    }
    this.subForm = this.formBuilder.group({
      bf: [data.bf, Validators.required],
      subAmount: [data.subAmount, Validators.required],
      target: [data.target, Validators.required],
      contribCount: [data.contribCount, Validators.required],
      subDate: [new Date(data.subDate), Validators.required],
      type: [data.type?.id, Validators.required],
      personnel: [data.personnel?.id, Validators.required],
    });

    this.formValueChanges();
    this.http.getTypes().pipe(first()).subscribe(res => {
      this.types = [...res];
      this.dataLoaded = true;
    });
  }

  getPeriods(selType: ContributionType) {
    return getPeriodLabel(selType.noPerYear);
  }

  submitForm() {
    this.submitted = true;
    this.subForm.updateValueAndValidity();

    if (this.subForm.invalid) {
      return;
    }

    let data = this.subForm.value;
    data.type = this.selType;
    data.personnel = this.personnel;

    if (this.contribution?.id) {
      data = {...this.contribution, ...data};
      return this.put(data);
    }

    return this.post(data);
  }

  private formValueChanges() {
    this.f.type.valueChanges.subscribe(value => {
      this.selType = this.types.find(t => t.id === +value);
      this.f.subAmount.setValidators([Validators.required, Validators.min(this.selType.minAmount), Validators.max(this.selType.maxAmount)]);
      this.f.subAmount.updateValueAndValidity({onlySelf: true, emitEvent: false});
    });
  }

  private post(data: Contributions) {
    this.http.saveSubs(data).pipe(first()).subscribe(res => {
      this.subs.emit(res);
      this.messageService.add({
        severity: 'success',
        summary: 'Subscription Success',
        detail: this.personnel.name + ' ' + res.type.name + ' subscription completed successfully',
      });
    });
  }

  private put(data: Contributions) {
    this.http.editSubs(data).pipe(first()).subscribe(res => {
      this.subs.emit(res);
      this.messageService.add({
        severity: 'success',
        summary: 'Update Success',
        detail: this.personnel.name + ' ' + res.type.name + ' subscription updated successfully',
      });
    });
  }
}
