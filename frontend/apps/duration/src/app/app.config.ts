import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {authTokenInterceptor} from './auth/auth.interceptor';
import {RouteLoggerService} from './data/router-log.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes,),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideAnimationsAsync(),
    RouteLoggerService,
  ],
};

