import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistoryComponent } from './components/history/history.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Default redirect to login
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Auth routes (public)
  { path: 'login',  component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Dashboard - PUBLIC
  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  // HISTORY - PROTECTED
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [authGuard]
  },

  // Profile - Protected(login required)
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },

  // Fallback
  { path: '**', redirectTo: '/dashboard' }
];