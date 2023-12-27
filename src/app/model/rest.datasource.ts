import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RestDataSource {
  baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  async getUser(pseudo: string) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/authentication/login`,
      { firstName: pseudo },
    ));
  }

  async getBetsFromUser(firstName: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/bets?firstName=${firstName}`))
  }

  async createBet(formInput: any) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/bets`, formInput));
  }
}
