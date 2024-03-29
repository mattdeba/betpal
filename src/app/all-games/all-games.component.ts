import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestDataSource } from '../model/rest.datasource';
import { AuthenticationService } from '../services/authentication.service';
import { ModelModule } from '../model/model.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [CommonModule, ModelModule, FormsModule],
  templateUrl: './all-games.component.html',
  styleUrl: './all-games.component.css'
})
export class AllGamesComponent {
  allGames: any[] = [];

  constructor(private dataSource: RestDataSource, private authService: AuthenticationService, private router: Router) {} // Inject Router

  async ngOnInit() {
    this.allGames = await this.dataSource.getAllGames();
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
}
