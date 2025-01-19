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
  console.log('Checking authentication:', authService.isAuthenticated); // Add this

  if (!authService.isAuthenticated) {
    console.log('User not authenticated. Redirecting to login.'); // Add this
    authService.logout();
    return false;
  }

  console.log('User authenticated. Granting access.'); // Add this
  return true;
};
