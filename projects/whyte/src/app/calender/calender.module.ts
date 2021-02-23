import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalenderComponent } from './calender.component';
import {RouterModule, Routes} from "@angular/router";
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Calender'
    },
    children: [
      {
        path: '',
        component: CalenderComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [CalenderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FullCalendarModule
  ]
})
export class CalenderModule { }
