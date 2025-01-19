import {AuthService} from './auth.service';
import {inject} from '@angular/core';


// export const canActivateAuth = () => {
//   const authService = inject(AuthService)
//
//   if (!authService.isAuthenticated) {
//     authService.logout()
//     return false
//   }
//
//   return true
// }

export const canActivateAuth = () => {
  const authService = inject(AuthService);

  console.log('Auth Guard: Checking isAuthenticated', authService.isAuthenticated);

  if (!authService.isAuthenticated) {
    console.log('Auth Guard: User not authenticated, redirecting to logout');
    authService.logout();
    return false;
  }

  console.log('Auth Guard: User is authenticated, proceeding');
  return true;
};



