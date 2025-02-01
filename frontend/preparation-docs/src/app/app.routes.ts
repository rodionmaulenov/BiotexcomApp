import { Routes } from '@angular/router';

export const routes: Routes = [
   {path: 'fillDoc', loadChildren: () => import('./fill-doc/fill-doc.routes').then(m => m.routes)}
];
