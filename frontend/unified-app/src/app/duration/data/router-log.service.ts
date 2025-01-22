import {Injectable} from '@angular/core';
import {Router, NavigationEnd, NavigationStart, Event} from '@angular/router';

@Injectable({providedIn: 'root'})
export class RouteLoggerService {
  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started to:', event.url);
      } else if (event instanceof NavigationEnd) {
        console.log('Navigation ended at:', event.url);
      }
    });
  }
}
