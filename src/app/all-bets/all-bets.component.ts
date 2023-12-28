import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { RestDataSource } from '../model/rest.datasource';
import { ModelModule } from '../model/model.module';

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
      console.log(this.userBets);
      console.log(allBets);
      this.allBets = allBets.filter((bet: any) => !this.userBets.map(bet => bet.id).includes(bet.id));    }
  }
}
