import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
<<<<<<< HEAD:frontend/unified-app/src/app/app.config.ts
import {authTokenInterceptor} from './duration/auth/auth.interceptor';
=======
import {authTokenInterceptor} from './auth/auth.interceptor';
import {RouteLoggerService} from './data/router-log.service';
>>>>>>> origin/prod:frontend/apps/duration/src/app/app.config.ts


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes,),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
<<<<<<< HEAD:frontend/unified-app/src/app/app.config.ts
    provideAnimationsAsync(), provideAnimationsAsync(),
  ],
}
=======
    provideAnimationsAsync(),
    RouteLoggerService,
  ],
};

>>>>>>> origin/prod:frontend/apps/duration/src/app/app.config.ts
