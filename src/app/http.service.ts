import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  [x: string]: any;
  private _stream$ = new BehaviorSubject("");
  public stream$ = this._stream$.asObservable();
  constructor(private _http: HttpClient) { 
  
  }
  addUser(newUser) {
    return this._http.post('/projects/new/user', {newUser : newUser})
  }
  addTeam(newTeam) {
    return this._http.post('/projects/new/team', {newTeam : newTeam})
  }
  loginUser(loginUser) {
    return this._http.post('/projects/login/user', {loginUser: loginUser})
  }
  send(session : any) {
    this._stream$.next(session)
  }
  checkSession() {
    return this._http.get('/projects/session')
  }
  checkAdmin() {
    return this._http.get('/projects/admin')
  }
  getTeams() {
    return this._http.get('/projects/teams')
  }
  getTeam(name) {
    return this._http.get('/projects/team/' + name)
  }
  updateTeam(updateTeam) {
    return this._http.put('/projects/team/' + updateTeam._id, {updateTeam : updateTeam})
  }
  getOrders() {
    return this._http.get('/projects/orders')
  }
  getUserOrders(id) {
    return this._http.get('/projects/orders/' + id)
  }
  buyShare(newOrder, user_id, team_id, teamName) {
    return this._http.post('/projects/orders/new/' + user_id + '/' + team_id + '/' + teamName, {newOrder : newOrder})
  }
  sellShare(newSaleOrder, user_id, team_id, teamName) {
    return this._http.post('/projects/orders/new/sell/' + user_id + '/' + team_id + '/' + teamName, {newSaleOrder : newSaleOrder})
  }
  getShares(user_id, team_id) {
    return this._http.get('/projects/shares/' + user_id + '/' + team_id)
  }
  logout() {
    return this._http.get('/projects/logout')
  }
}
