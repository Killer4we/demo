import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignUpComponent } from './components/signup/signup';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component:LoginComponent },
  { path: 'register', component:SignUpComponent },
  { path: 'dashboard', canActivate: [authGuard], component:Dashboard},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
