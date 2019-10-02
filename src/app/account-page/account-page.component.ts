import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  session: any;
  orders: [];
  teams: [];
  constructor(private _httpService: HttpService, private router: Router) { 
    this._httpService.stream$.subscribe(this.receiveMessage.bind(this));
  }

  ngOnInit() {
    this.checkSession();
    this.receiveMessage(this.session);
    this.getTeams();
    this.getUserOrders(this.session._id);
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
  getTeams() {
    let observable = this._httpService.getTeams();
    observable.subscribe(data => {
      console.log("Got the teams", data)
      this.teams = data['teams']
    })
  }
  getUserOrders(id) {
    let observable = this._httpService.getUserOrders(id);
    observable.subscribe(data => {
      console.log("Got the User orders!", data)
      this.orders = data['userOrders']
    })
  }
}
