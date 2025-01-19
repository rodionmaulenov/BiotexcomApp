import {Routes} from '@angular/router';
import {LoginPageComponent} from './auth/login-page/login-page.component';

export const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login'},
];


import {Router} from '@angular/router';
import {inject} from '@angular/core';

const router = inject(Router);
router.events.subscribe(event => {
  console.log('Router event:', event);
});
