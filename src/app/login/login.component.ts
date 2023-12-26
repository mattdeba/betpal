import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestDataSource } from '../model/rest.datasource';
import { ModelModule } from '../model/model.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ModelModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  pseudo: string;
  user: any;

  constructor(private dataSource: RestDataSource, private router: Router) { }

  async onSubmit() {
    try {
      const user = await this.dataSource.getUser(this.pseudo);
      if (user) {
        this.user = user;
        await this.router.navigate(['/home'])
      }
    } catch (e) {
      console.log(e);
    }
  }
}
