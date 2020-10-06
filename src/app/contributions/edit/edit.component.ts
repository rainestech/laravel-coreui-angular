import {Component, OnInit} from '@angular/core';
import {Personnel} from '../../members/emplyees.model';
import {Contributions, ContributionType} from '../contributions.model';
import {ContributionsService} from '../contributions.service';
import {first} from 'rxjs/operators';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  personnel: Personnel;
  contribution: Contributions;
  selType: ContributionType;
  types: ContributionType[] = [];
  dataLoaded = false;
  reset: boolean;

  constructor(private http: ContributionsService, private dataStore: DataService) {
  }

  ngOnInit(): void {
    this.http.getTypes().pipe(first()).subscribe(res => {
      this.types = [...res];
      this.dataLoaded = true;
    });
  }

  getData(event: Personnel) {
    this.personnel = event;
    this.getContributions();
  }

  getType(event: number) {
    this.selType = this.types.find(t => t.id === +event);
    this.getContributions();
  }

  submitted(event: any) {
    this.contribution = null;
    this.personnel = null;
    this.dataStore.setFilterSearch(true);
  }

  private getContributions() {
    if (!this.personnel || !this.selType) {
      return;
    }

    this.http.getMySubByType(this.personnel.id, this.selType.id).pipe(first()).subscribe(res => {
      this.contribution = res;
    });
  }
}
