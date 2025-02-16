import { Routes } from '@angular/router';

export const routes: Routes = [
   {path: 'fillDoc', loadChildren: () => import('./side-bar/route').then(m => m.routes)}
]
