import {Routes} from '@angular/router';
import {DelayCountriesPageComponent} from './pages/delay-countries-page/delay-countries-page.component';
import {CreateProfilePageComponent} from './pages/create-profile-page/create-profile-page.component';
import {ChangeProfilePageComponent} from './pages/change-profile-page/change-profile-page.component';
import {LayoutComponent} from './common-ui/layout/layout.component';
import {canActivateAuth} from './auth/auth.guard';


export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {path: 'delay', component: DelayCountriesPageComponent},
      {path: 'create-profile', component: CreateProfilePageComponent},
      {path: 'change-profile/:profileId', component: ChangeProfilePageComponent},
    ],
    canActivate: [canActivateAuth],
  },
<<<<<<< HEAD:frontend/unified-app/src/app/duration/duration.routes.ts
]

=======
];

// Add this to debug navigation events
import {Router} from '@angular/router';
import {inject} from '@angular/core';

const router = inject(Router);
router.events.subscribe(event => {
  console.log('Router event:', event);
});
>>>>>>> origin/prod:frontend/apps/duration/src/app/app.routes.ts
