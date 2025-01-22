import {Routes} from '@angular/router';


export const routes: Routes = [
  {path: 'login', loadChildren: () => import('./login/login.routes').then(m => m.routes)},
  {path: 'duration', loadChildren: () => import('./duration/duration.routes').then(m => m.routes)},
]
