import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'login-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>
        Username:
        <input formControlName="username"/>
      </label>
      <label>
        Password:
        <input formControlName="password" type="password"/>
      </label>
      <button type="submit">Login</button>
    </form>
  `,
  styles: [],
})
export class LoginPageComponent {

  form = new FormGroup({
    username: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    password: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
  });

  constructor(private authService: AuthService) {
  }

  onSubmit() {
    if (this.form.valid) {
      const username = this.form.controls.username.value
      const password = this.form.controls.password.value
      this.authService.login(username, password)
    }
  }

}
