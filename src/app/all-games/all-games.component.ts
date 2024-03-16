import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestDataSource } from '../model/rest.datasource';
import { AuthenticationService } from '../services/authentication.service';
import { ModelModule } from '../model/model.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {logoMapping, teamMapping} from '../../constants';
import { utcToZonedTime, format } from 'date-fns-tz';
import { fr } from 'date-fns/locale';
import { isTomorrow } from 'date-fns';
import { isToday } from 'date-fns';

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [CommonModule, ModelModule, FormsModule],
  templateUrl: './all-games.component.html',
  styleUrl: './all-games.component.css'
})
export class AllGamesComponent {
  allGames: any[] = [];
  sliderValues: Map<string, WritableSignal<number>> = new Map();
  betAmounts: Map<string, WritableSignal<number>> = new Map();
  leftPercentages: Map<string, Signal<number>> = new Map();
  rightPercentages: Map<string, Signal<number>> = new Map();
  leftOdds: Map<string, Signal<number>> = new Map();
  rightOdds: Map<string, Signal<number>> = new Map();
  potentials: Map<string, Signal<number>> = new Map();
  oddSelecteds: Map<string, WritableSignal<'left'|'right'>> = new Map();
  initialBetAmount = 10;
  initalOddSelected: 'left' | 'right' = 'left';
  constructor(private dataSource: RestDataSource, private authService: AuthenticationService, private router: Router) {} // Inject Router

  async ngOnInit() {
    this.allGames = await this.dataSource.getAllGames();
    this.allGames.forEach(game => {
      const sliderValue = signal(50);
      const betAmount = signal(this.initialBetAmount);
      const oddSelected = signal<'left'|'right'>(this.initalOddSelected);
      this.sliderValues.set(game.id, sliderValue);
      this.betAmounts.set(game.id, betAmount);
      const leftPercentage = computed(() => sliderValue())
      const rightPercentage = computed(() => 100-sliderValue())
      this.leftPercentages.set(game.id, leftPercentage);
      this.rightPercentages.set(game.id, rightPercentage);
      const leftOdd =  computed(() => Math.ceil(100/leftPercentage() * 100)/100);
      const rightOdd =  computed(() => Math.ceil(100/rightPercentage() * 100)/100);
      this.leftOdds.set(game.id, leftOdd);
      this.rightOdds.set(game.id, rightOdd);
      this.potentials.set(game.id, computed(() => {
        const selectedOdd = this.oddSelecteds.get(game.id)?.() === 'left' ? leftOdd() : rightOdd();
        return Math.ceil(betAmount() * selectedOdd * 100)/100;
      }));
      this.oddSelecteds.set(game.id, oddSelected);
    });
  }

  async createBet(gameId: string, betAmount: string, desiredAmount: string, chosenTeam: string) {
    try {
      const user = this.authService.getUser();
      if (!user) {
        alert("veuillez vous connecter");
      }
      const currentGame = this.allGames.filter((g) => g.id === gameId)[0];
      if (user) {
        const payload = {
          gameId,
          amount: +betAmount,
          target: +desiredAmount,
          chosenTeam,
          creatorEmail: user.email,
          homeTeamWinner: chosenTeam === currentGame.homeTeam,
          assertion: `Victoire de ${currentGame.homeTeam} contre ${currentGame.awayTeam} ${this.formatDate(currentGame.dateTimeUTC)}`
        }
        await this.dataSource.createBet(payload);
        this.allGames = await this.dataSource.getAllGames();
        await this.router.navigate(['/mybets']);
      }
    } catch (error) {
      console.error('Error creating bet:', error);
    }
  }

  formatDate(dateUTC: string): string {
    const date = new Date(dateUTC);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont indexés à partir de 0
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `le ${day}/${month}/${year} à ${hours}:${minutes}`;
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

  getUrlFromKey(key: string) {
    return logoMapping[key as keyof typeof logoMapping];
  }
  getTeamFromKey(key: string) {
    return teamMapping[key as keyof typeof teamMapping];
  }

  updateSliderValue(event: Event, gameId: string) {
    const value = +(event.target as HTMLInputElement).value;
    this.sliderValues.get(gameId)?.set(value);
  }

  updateBetAmount(event: Event, gameId: string) {
    const value = +(event.target as HTMLInputElement).value;
    this.betAmounts.get(gameId)?.set(value);
  }

  updateOddSelected(gameId: string, position: 'left'|'right') {
    this.oddSelecteds.get(gameId)?.set(position);
  }

  protected readonly Math = Math;
}
