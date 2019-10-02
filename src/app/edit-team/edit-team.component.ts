import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit {
  session: any;
  singleTeam;
  updateTeam;
  admin: any;
  constructor(private _httpService: HttpService, private route: ActivatedRoute, private router: Router) { 
    this._httpService.stream$.subscribe(this.receiveMessage.bind(this));
  }

  ngOnInit() {
    this.checkSession();
    this.checkAdmin();
    this.receiveMessage(this.session);
    this.route.params.subscribe((params: Params) => {
      this.getTeam(params['name'])
    })
  }
  getTeam(name : String) {
    let observable = this._httpService.getTeam(name)
    observable.subscribe(data => {
      console.log("Got team data!", data)
      this.singleTeam = data['team']
      this.updateTeam = data['team']
    })
  }
  editTeamSubmit() {
    let observable = this._httpService.updateTeam(this.updateTeam)
    observable.subscribe(data => {
      console.log("Got the new data!", data)
      this.updateTeam = data['team']
      this.singleTeam = data['team']
      console.log(this.singleTeam)
    })
    this.router.navigate([''])
  }
  checkAdmin() {
    let observable = this._httpService.checkAdmin();
    observable.subscribe(data => {
      this.admin = data['user']
    })
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
