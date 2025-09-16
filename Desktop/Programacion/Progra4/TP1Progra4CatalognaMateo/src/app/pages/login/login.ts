import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';
  showModal = false; 

  quickAccessAccounts = [
    { label: 'Usuario 1', email: 'catalognamateo@gmail.com', password: '123456' },
    { label: 'Usuario 2', email: 'test@test', password: '123456' },
    { label: 'Usuario 3', email: 'prueba@prueba', password: '123456' }
  ];

  constructor(private fb: FormBuilder, private supabase: SupabaseService, private router: Router) {
    this.loginForm = this.fb.group({ //crea el FormGroup con dos controles:
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    this.errorMessage = '';
    this.showModal = false;

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      this.showModal = true;
      return;
    }

    const { email, password } = this.loginForm.value; //Extrae email y password con destructuring

    try {
      const user = await this.supabase.signIn(email, password); // metoodo del servicio de supabase
      console.log('Usuario logueado:', user);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.message;
      this.showModal = true;
    }
  }


  async quickLogin(account: { email: string; password: string }) {
    this.loginForm.setValue({ email: account.email, password: account.password }); 
    await this.login();
  }

  closeModal() {
    this.showModal = false;
  }
}
