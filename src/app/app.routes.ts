import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MybetsComponent } from './mybets/mybets.component';
import { CreateBetComponent } from './create-bet/create-bet.component';
import { EditBetComponent } from './edit-bet/edit-bet.component';
import { AllBetsComponent } from './all-bets/all-bets.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  { path: 'mybets', component: MybetsComponent },
  {path: 'mybets/create', component: CreateBetComponent},
  { path: 'mybets/edit/:id', component: EditBetComponent },
  { path: 'allbets', component: AllBetsComponent },
];
