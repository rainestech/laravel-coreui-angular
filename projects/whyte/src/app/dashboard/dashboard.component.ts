import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {AngularFirestore} from "@angular/fire/firestore";
import {ProfileService} from "../profile/profile.service";
import {first} from "rxjs/operators";
import {Cols} from "../admin/users.model";
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  radioModel: string = 'Month';
  maxValue = 10;

  // mainChart
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];
  public mainChartData4: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Total Tasks'
    },
    {
      data: this.mainChartData2,
      label: 'Done'
    },
    {
      data: this.mainChartData3,
      label: 'In Progress'
    },
    {
      data: this.mainChartData3,
      label: 'Backlog'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(100 / 5),
          max: this.maxValue
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--warning'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';
  dataLoaded: boolean = false;
  onlineStatus: Subscription;
  chatStatusList: any[];
  onLine: number;
  today = new Date();
  dashBoard: any;
  backlog: number = 0;
  inProgress: number = 0;
  doneTask: number = 0;
  cols: Cols[] = [];
  @ViewChild('dt') dataTable: any;

  constructor(private firestore: AngularFirestore, private http: ProfileService) {}

  static random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnInit(): void {
    this.cols = [
      {header: 'Name', field: 'name'},
      {header: 'Channel', field: 'channel'},
      {header: 'Date', field: 'date'},
      {header: 'Added By', field: 'editor'},
      {header: 'Followers', field: 'followers'},
    ];

    this.onlineStatus = this.firestore.collection('/status')
        .valueChanges().subscribe(res => {
          this.chatStatusList = res;
          this.onLine = this.chatStatusList.filter(r => r.message === 'online').length;
    });

    this.http.getDashboard().pipe(first()).subscribe(res => {
      this.dashBoard = res;
      this.maxValue = res.tasks.length;
      this.backlog = this.dashBoard.tasks.filter(t => t.tab === 'incoming').length;
      this.inProgress = this.dashBoard.tasks.filter(t => t.tab === 'progress').length;
      this.doneTask = this.dashBoard.tasks.filter(t => t.tab === 'done').length;

      this.mainChartLabels = this.dashBoard.channels.map(c => c.name);
      res.channels.forEach(r => {
        this.mainChartData1.push(res.tasks.filter(t => t.channel === r.name).length);
        this.mainChartData2.push(res.tasks.filter(t => t.channel === r.name && t.tab === 'done').length);
        this.mainChartData3.push(res.tasks.filter(t => t.channel === r.name && t.tab === 'progress').length);
        this.mainChartData4.push(res.tasks.filter(t => t.channel === r.name && t.tab === 'incoming').length);
      });

    this.mainChartOptions = {
        tooltips: {
          enabled: false,
          custom: CustomTooltips,
          intersect: true,
          mode: 'index',
          position: 'nearest',
          callbacks: {
            labelColor: function(tooltipItem, chart) {
              return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function(value: any) {
                return value.charAt(0);
              }
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              stepSize: Math.ceil(100 / 5),
              max: this.maxValue + 5
            }
          }]
        },
        elements: {
          line: {
            borderWidth: 2
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          }
        },
        legend: {
          display: false
        }
      };


      this.dataLoaded = true;
    });
  }

  ngOnDestroy(): void {
      this.onlineStatus?.unsubscribe();
  }
}
