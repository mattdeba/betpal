import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class RestDataSource {
  baseUrl = environment.baseUrl;
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

  async getBet(id: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/bets/${id}`));
  }

  async updateBet(bet: any): Promise<any> {
    return firstValueFrom(this.http.patch(`${this.baseUrl}/bets/${bet.id}`, bet));
  }

  async deleteBet(id: string): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/bets/${id}`));
  }

  async getAllBets(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/bets`));
  }

  async acceptBet(id: string, acceptorEmail: string): Promise<any> {
  return firstValueFrom(this.http.post(`${this.baseUrl}/bets/${id}/accept`, { acceptorEmail }));
}
}
