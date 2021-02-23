import {Component, OnInit, ViewChild} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {FullCalendar} from "primeng/fullcalendar";

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

  events: any[] = [];
  options: any;
  @ViewChild('calendar') private calendar: FullCalendar;

  constructor() { }

  ngOnInit(): void {
    this.options = {
      initialView: 'dayGridMonth',
      // dateClick: this.handleDateClick.bind(this), // bind is important!
      // eventClick: this.handleEventClick.bind(this),
      events: [
        { title: 'event 1', date: '2021-02-01' },
        { title: 'event 2', date: '2021-02-02' }
      ]
    };
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }

  handleEventClick(arg) {
    alert('date click! ' + JSON.stringify(arg))
  }

}
