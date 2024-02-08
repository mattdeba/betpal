import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    this.loadUserFromLocalStorage();
  }

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return this.userSubject.value;
  }

  isLoggedIn() {
    return this.getUser() !== null;
  }

  private loadUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }
  async logout() {
  localStorage.removeItem('user');
  this.userSubject.next(null);
  await this.router.navigateByUrl('/home');
}
}
