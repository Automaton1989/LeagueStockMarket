import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  session: any;
  teams: [];
  orders: [];
  shares: null;
  team: any;
  admin = false;
  constructor(private _httpService: HttpService, private router: Router) { 
    this._httpService.stream$.subscribe(this.receiveMessage.bind(this));
  }

  ngOnInit() {
    this.checkSession();
    this.checkAdmin();
    this.receiveMessage(this.session);
    this.getTeams();
    this.getOrders();
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
  checkAdmin() {
    let observable = this._httpService.checkAdmin();
    observable.subscribe(data => {
      this.admin = data['user']
    })
  }
  getTeams() {
    let observable = this._httpService.getTeams();
    observable.subscribe(data => {
      console.log("Got the teams", data)
      this.teams = data['teams']
    })
  }
  getOrders() {
    let observable = this._httpService.getOrders();
    observable.subscribe(data => {
      console.log("Got the orders!", data)
      this.orders = data['orders']
    })
  }
}
