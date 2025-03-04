import {inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Subject, takeUntil} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';


type AuthTokenResponse = {
  access: string
  refresh: string
}


@Injectable({providedIn: 'root'})
export class AuthService implements OnDestroy {
  private readonly baseApiUrl: string = environment.apiUrl
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private cookieService = inject(CookieService)
  private destroy$ = new Subject<void>()


  login(username: string, password: string) {
    return this.http.post<AuthTokenResponse>(`${this.baseApiUrl}token/`, {username, password})
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: AuthTokenResponse) => {
        const isSecure = environment.production
        this.cookieService.set('token', response.access, {
          secure: isSecure,
          sameSite: isSecure ? 'None' : 'Lax',
          path: '/'
        })
        this.cookieService.set('refresh', response.refresh, {
          secure: isSecure,
          sameSite: isSecure ? 'None' : 'Lax',
          path: '/'
        })

        this.router.navigate(['/duration'])

      })
  }


  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
