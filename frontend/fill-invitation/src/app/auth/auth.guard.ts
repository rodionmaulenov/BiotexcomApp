import {AuthService} from './auth.service';
import {inject} from '@angular/core';


export const canActivateAuth = () => {
  const authService = inject(AuthService)

  if (!authService.isAuthenticated) {
    authService.logout()
    return false
  }
  return true
}




