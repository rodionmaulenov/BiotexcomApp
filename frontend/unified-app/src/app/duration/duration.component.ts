import { Component } from '@angular/core';
import {LayoutComponent} from './common-ui/layout/layout.component';

@Component({
  selector: 'app-duration',
  standalone: true,
  templateUrl: './duration.component.html',
  imports: [
    LayoutComponent
  ],
  styleUrl: './duration.component.scss'
})
export class DurationComponent {

}
