import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logout',
  imports: [CommonModule, FormsModule,ReactiveFormsModule,TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
errorMessage: string | null = null;
registerForm: FormGroup;


  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
   this.registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });
  }

  async onGoogle() {
    await this.auth.googleSignIn();
    this.router.navigate(['/Home']);
  }

  passwordMatchValidator(form: any) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  async onRegister() {
    if (this.registerForm.invalid) return;

    const { email, password } = this.registerForm.value;

    try {
      await this.auth.register(email!, password!);
      this.router.navigate(['/Login']);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        this.errorMessage = 'This email is already registered. Try logging in.';
      } else {
        this.errorMessage = err.message;
      }
    }
  }
}
