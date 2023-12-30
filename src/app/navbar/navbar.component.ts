import { Component, ElementRef, HostListener } from '@angular/core';
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
  isMobile: boolean = false;
  isExpanded: boolean = false;


  constructor(public authService: AuthenticationService, private eRef: ElementRef) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.score = user.points;
      }
    });
    this.checkWindowSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isExpanded = false;
      let sidenav = document.querySelector('.sidenav');
      if (sidenav) {
        sidenav.classList.remove('isExpanded');
      }
    }
  }

  private checkWindowSize() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    let sidenav = document.querySelector('.sidenav');
    if (sidenav === null) {
      return;
    }
    if (this.isExpanded) {
      sidenav.classList.add('isExpanded');
    } else {
      sidenav.classList.remove('isExpanded');
    }
  }

  closeSidenav() {
    this.isExpanded = false;
    let sidenav = document.querySelector('.sidenav');
    if (sidenav) {
      sidenav.classList.remove('isExpanded');
    }
  }

}
