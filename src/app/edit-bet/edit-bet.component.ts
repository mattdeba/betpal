import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestDataSource } from '../model/rest.datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModelModule } from '../model/model.module';

@Component({
  selector: 'app-edit-bet',
  standalone: true,
  imports: [CommonModule, FormsModule, ModelModule],
  templateUrl: './edit-bet.component.html',
  styleUrl: './edit-bet.component.css'
})
export class EditBetComponent {
  bet: any = {};

  constructor(private dataSource: RestDataSource, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe((params: { [x: string]: string; }) => {
      this.dataSource.getBet(params['id']).then(bet => this.bet = bet);
    });
  }

  async onSubmit() {
    await this.dataSource.updateBet({
      id: this.bet.id,
      amount: this.bet.amount,
      target: this.bet.amount + this.bet.desiredAmount,
      assertion: this.bet.assertion,
    });
    await this.router.navigate(['/mybets']);
  }
}
