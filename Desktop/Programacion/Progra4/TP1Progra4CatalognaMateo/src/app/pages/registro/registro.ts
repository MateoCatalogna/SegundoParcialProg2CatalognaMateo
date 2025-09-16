import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'] // CORRECCIÓN
})
export class Registro {
  nombre = '';
  apellido = '';
  edad: number | null = null;
  email = '';
  password = '';

  errorMessage = '';
  successMessage = '';
  loading = false;

  private supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async register() {
    this.errorMessage = '';
    this.successMessage = '';

    // validaciones básicas
    const email = this.email.trim();
    const password = this.password;
    if (!email) { this.errorMessage = 'Email requerido'; return; }
    if (!password || password.length < 6) { this.errorMessage = 'Contraseña mínima 6 caracteres'; return; }
    if (this.edad != null && this.edad < 0) { this.errorMessage = 'Edad inválida'; return; }

    this.loading = true;
    try {
      const { data, error } = await this.supabase.auth.signUp({ email, password });
      await this.supabase.auth.signOut();

      if (error) {
        this.errorMessage = error.message ?? 'Error al crear la cuenta';
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        this.successMessage = 'Usuario creado correctamente.';
        return;
      }

      // Usar upsert para no romper si ya existe (o insert si preferís)
      const { error: insertError } = await this.supabase
        .from('usuarios') // se insertan los datos del perfil del usaurio en la tabla usuarios
        .upsert([{ id: userId, nombre: this.nombre.trim(), apellido: this.apellido.trim(), edad: this.edad }], { onConflict: 'id' }); //upsert con onConflict: 'id' evita errores si el registro ya existe

      if (insertError) {
        this.errorMessage = 'Error al guardar datos: ' + (insertError.message ?? 'Desconocido');
        return;
      }

      this.successMessage = 'Cuenta creada 🎉';
      await this.router.navigate(['/home']);
    } catch (err: any) {
      this.errorMessage = err?.message ?? 'Error inesperado';
    } finally {
      this.loading = false;
    }
  }
}
