import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { RestDataSource } from '../model/rest.datasource';
import { ModelModule } from '../model/model.module';
import { logoMapping, teamMapping } from '../../constants';
import { format, utcToZonedTime } from 'date-fns-tz';
import { isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-all-bets',
  standalone: true,
  imports: [CommonModule, ModelModule],
  templateUrl: './all-bets.component.html',
  styleUrl: './all-bets.component.css'
})
export class AllBetsComponent {
  allBets: any[] = [];
  userBets: any[] = [];

  constructor(private dataSource: RestDataSource,
              private authService: AuthenticationService) {
  }

  async ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userBets = await this.dataSource.getBetsFromUser(user.firstName);
      const allBets = await this.dataSource.getAllBets();
      this.allBets = allBets.filter((bet: any) => !this.userBets.map(bet => bet.id).includes(bet.id));    }
  }

  async acceptBet(betId: string) {
    try {
      const user = this.authService.getUser();
      if (!user) {
        alert("veuillez vous connecter");
      }
      if (user) {
        await this.dataSource.acceptBet(betId, user.email);
        const updatedUser = await this.dataSource.getUser(user.firstName);
        this.authService.setUser(updatedUser);
        this.allBets = await this.dataSource.getAllBets();
      }
    } catch (error) {
      console.error('Error accepting bet:', error);
    }
  }


  getUrlFromKey(key: string) {
    return logoMapping[key as keyof typeof logoMapping];
  }
  getTeamFromKey(key: string) {
    return teamMapping[key as keyof typeof teamMapping];
  }

  convertUTCtoParisTime(date: Date): string {
    const parisTimeZone = 'Europe/Paris';
    const zonedDate = utcToZonedTime(date, parisTimeZone);
    let formattedDay;
    if (isToday(zonedDate)) {
      formattedDay = 'Aujourd\'hui';
    } else if (isTomorrow(zonedDate)) {
      formattedDay = 'Demain';
    } else {
      formattedDay = format(zonedDate, 'eee d', { locale: fr });
    }
    const formattedTime = format(zonedDate, 'HH:mm');
    return `${formattedDay}\n${formattedTime}`;
  }

}
