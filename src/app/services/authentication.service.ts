import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user: any = {
    id: 1,
    firstName: 'matthieu',
    lastName: 'debarge',
    email: 'debarge.matthieu@gmail.com',
    points: 100
  };

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

}
