import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestDataSource } from '../model/rest.datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModelModule } from '../model/model.module';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-edit-bet',
  standalone: true,
  imports: [CommonModule, FormsModule, ModelModule],
  templateUrl: './edit-bet.component.html',
  styleUrl: './edit-bet.component.css'
})
export class EditBetComponent {
  bet: any = {};
  betAmount: number;
  desiredAmount: number;
  selectedGame: any;
  selectedTeam: string;
  allGames: any[] = [];

  constructor(private dataSource: RestDataSource,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthenticationService) {
    this.route.params.subscribe((params: { [x: string]: string; }) => {
      this.dataSource.getBet(params['id']).then(bet => this.bet = bet);
    });
  }

  async ngOnInit() {
    const games = await this.dataSource.getAllGames();
    this.allGames = games.filter((game: any) => !game.isClosed);
    this.selectedGame = this.allGames.length > 0 ? this.allGames[0] : null;
  }

async onSubmit() {
  const otherTeam = this.selectedGame.homeTeam === this.selectedTeam ? this.selectedGame.awayTeam : this.selectedGame.homeTeam;
  const formInput = {
    id: this.bet.id,
    amount: this.betAmount,
    target: this.betAmount + this.desiredAmount,
    assertion: `Victoire de ${this.selectedTeam} contre ${otherTeam} ${this.formatDate(this.selectedGame.dateTimeUTC)}`,
    gameId: this.selectedGame.id,
    homeTeamWinner: this.selectedTeam === this.selectedGame.homeTeam,
    creatorEmail: this.authService.getUser().email,
  }
  await this.dataSource.updateBet(formInput);
  const updatedUser = await this.dataSource.getUser(this.authService.getUser().firstName);
  this.authService.setUser(updatedUser);
  await this.router.navigate(['/mybets']);
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
