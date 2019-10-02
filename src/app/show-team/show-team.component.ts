import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from '../http.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Chart from 'chart.js';

@Component({
  selector: 'app-show-team',
  templateUrl: './show-team.component.html',
  styleUrls: ['./show-team.component.css']
})
export class ShowTeamComponent implements OnInit {
  @ViewChild("chart", {static: true}) refChart: ElementRef;
  public chartData: any;
  team: any;
  orders: [];
  newOrder: any;
  newSaleOrder: any;
  session: any;
  shares: null;
  constructor(private _httpService: HttpService, private route: ActivatedRoute, private router: Router) { 
    this._httpService.stream$.subscribe(this.receiveMessage.bind(this));
    this.chartData = {}
  }

  ngOnInit() {
    this.checkSession();
    this.receiveMessage(this.session);
    this.route.params.subscribe((params: Params) => {
      this.getTeam(params['name'])
    })
    this.getOrders();
    this.newOrder = {amount: null, team_name: ""}
    this.newSaleOrder = {amount: null, team_name: ""}
  }
  getTeam(name : String) {
    let observable = this._httpService.getTeam(name)
    observable.subscribe(data => {
      console.log("Got team data!", data)
      this.team = data['team']
      this.getChart();
    })
  }
  getChart() {
    var data = [];
    var backgroundColor = [];
    var borderColor = [];
    var labels = [];
    for(let i = 0; i < this.team.value.length; i++) {
      data.push(this.team.value[i]);
      backgroundColor.push("#696969")
      borderColor.push("Black")
      labels.push("$" + this.team.value[i])
    }
    this.chartData = {
      labels: labels,
      datasets: [{
          label: 'Value',
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1
      }]
  };
  }
  receiveMessage(session) {
    this.session = session;
  }
  checkSession() {
    let observable = this._httpService.checkSession();
    observable.subscribe(data => {
      this.session = data['user']
      this._httpService.send(this.session)
    })
  }
  getOrders() {
    let observable = this._httpService.getOrders();
    observable.subscribe(data => {
      console.log("Got the orders!", data)
      this.orders = data['orders']
    })
  }
  buyShare(user_id, team_id, teamName) {
    let observable = this._httpService.buyShare(this.newOrder, user_id, team_id, teamName)
    observable.subscribe(data => {
      this.getShares(user_id, team_id)
      this.session = data['user']
      this._httpService.send(this.session)
      this.getTeam(teamName);
      this.newOrder = {amount: null, team_name: ""}
    })
  }
  sellShare(user_id, team_id, teamName) {
    let observable = this._httpService.sellShare(this.newSaleOrder, user_id, team_id, teamName)
    observable.subscribe(data => {
      this.getShares(user_id, team_id)
      this.session = this.checkSession();
      this._httpService.send(this.session)
      this.getTeam(teamName);
      this.newSaleOrder = { amount: null, team_name: ""}
    })
  }
  getShares(user_id, team_id) {
    let observable = this._httpService.getShares(user_id, team_id)
    observable.subscribe(data => {
      console.log("Got the shares!", data)
      this.shares = data['userShares']
    })
  }
  public ngAfterViewInit() {
    let chart = this.refChart.nativeElement;
    let ctx = chart.getContext("2d");
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: this.chartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
}
