import { Component } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'public';
  newUser: any;
  loginUser: any;
  session: any;
  admin = false;
  constructor(private _httpService: HttpService, private router: Router, private _home: HomepageComponent) {
    this._httpService.stream$.subscribe(this.receiveMessage.bind(this));
  }
  ngOnInit() {
    this.checkSession();
    this.checkAdmin();
    this.receiveMessage(this.session);
    this.newUser = {username: "", email: "", password: ""}
    this.loginUser = {email: "", password: ""}
  } 
  onSubmit() {
    let observable = this._httpService.addUser(this.newUser);
    observable.subscribe(data => {
      this.session = data['user']
      this._httpService.send(this.session)
      this.newUser = {username: "", email: "", password: ""}
    })
  }
  onLogin() {
    let observable = this._httpService.loginUser(this.loginUser);
    observable.subscribe(data => {
      this.session = data['user']
      this.checkAdmin()
      this._httpService.send(this.session)
      this.loginUser = {email: "", password: ""}
    })
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
  receiveMessage(session) {
    this.session = session;
  }
  logout() {
    let observable = this._httpService.logout();
    observable.subscribe(data => {
      console.log("coming back", data);
      this.checkSession();
      this.admin = false;
      this._httpService.send(this.session)
    })
  }
}
