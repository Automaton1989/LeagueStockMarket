import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  session: any;
  newTeam: any;
  teams: [];
  constructor(private _httpService: HttpService, private router: Router) { 
    this._httpService.stream$.subscribe(this.receiveMessage.bind(this));
  }
  ngOnInit() {
    this.checkSession();
    this.receiveMessage(this.session);
    this.newTeam = {name: "", titles: "", Image: "", description: "", shares: null, value: null}
  }
  onTeamSubmit() {
    let observable = this._httpService.addTeam(this.newTeam);
    observable.subscribe(data => {
      this.newTeam = data['team']
      this.newTeam = {name: "", titles: "", Image: "", description: "", shares: null, value: null}
      this.teams = data['teams']
    })
    this.router.navigate([''])
  }
  checkSession() {
    let observable = this._httpService.checkSession();
    observable.subscribe(data => {
      this.session = data['user']
      this._httpService.send(this.session)
    })
  }
  receiveMessage(session) {
    this.session = session;
  }
}
