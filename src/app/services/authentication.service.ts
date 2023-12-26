import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user: any = null;

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

}
