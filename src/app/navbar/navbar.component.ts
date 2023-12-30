import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  score: number;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.score = user.points;
      }
    });
  }
}
