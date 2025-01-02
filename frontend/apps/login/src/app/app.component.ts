import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LoginPageComponent} from './auth/login-page/login-page.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'login';
}
