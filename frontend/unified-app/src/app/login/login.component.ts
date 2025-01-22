import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from './auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService)
  form = new FormGroup({
    username: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    password: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
  })

  onSubmit() {
    if (this.form.valid) {
      const username = this.form.controls.username.value
      const password = this.form.controls.password.value
      this.authService.login(username, password)
    }
  }

}
