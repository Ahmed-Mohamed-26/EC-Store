import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ReactiveFormsModule, FormBuilder, Validators,FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup ;
  errorMessage: string = ''; 
 

  constructor( private fb: FormBuilder,private auth: AuthService, private router: Router) {
     this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email and password';
      return;
    }

    const { email, password } = this.loginForm.value;
    try {
      await this.auth.login(email, password);
      this.router.navigate(['/Home']);
    } catch (error) {
      this.errorMessage = 'Invalid email or password';
    }
  }
  async onGoogle() {
    try {
      await this.auth.googleSignIn();
      this.router.navigate(['/Home']);
    } catch (error) {
      this.errorMessage = 'Google login failed';
    }
  }
  get form() {
    return this.loginForm.controls;
  }
  goToRegister() {
  this.router.navigate(['/Register']);
}
}
