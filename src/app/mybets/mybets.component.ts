import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestDataSource } from '../model/rest.datasource';
import { AuthenticationService } from '../services/authentication.service';
import { ModelModule } from '../model/model.module';

@Component({
  selector: 'app-mybets',
  standalone: true,
  imports: [CommonModule, ModelModule],
  templateUrl: './mybets.component.html',
  styleUrl: './mybets.component.css'
})
export class MybetsComponent {
  bets: any[] = [];

  constructor(private dataSource: RestDataSource,
              private authService: AuthenticationService) {
  }

  async ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.bets = await this.dataSource.getBetsFromUser(user.firstName);
      console.log(this.bets);
    }
  }
}