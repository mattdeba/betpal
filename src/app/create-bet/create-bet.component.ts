import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RestDataSource } from '../model/rest.datasource';
import { ModelModule } from '../model/model.module';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-bet',
  standalone: true,
  imports: [CommonModule, FormsModule, ModelModule],
  templateUrl: './create-bet.component.html',
  styleUrl: './create-bet.component.css'
})
export class CreateBetComponent {
  betAmount: number;
  desiredAmount: number;
  assertion: string;

  constructor(private dataSource: RestDataSource,
              private authService: AuthenticationService,
              private router: Router) {
  }

  async onSubmit(form: NgForm) {
    const formInput = {
      amount: this.betAmount,
      target: this.betAmount + this.desiredAmount,
      assertion: this.assertion,
      creatorEmail: this.authService.getUser().email,
    }
    await this.dataSource.createBet(formInput);
    await this.router.navigateByUrl('/mybets');
  }
}
