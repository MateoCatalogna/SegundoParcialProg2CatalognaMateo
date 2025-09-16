import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { Observable } from 'rxjs'; //se usa para escuchar cambios en el usuario y su nombre.
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  // Observables del servicio (solo lectura)
  user$: Observable<User | null>; //Observable que emitirá el usuario autenticado actual (User) o null si no hay sesión activa.
  userName$: Observable<string | null>; //Observable que emitirá el nombre del usuario como string o null si no hay usuario logueado.


  constructor(private supabaseService: SupabaseService) {
    this.user$ = this.supabaseService.user$; //Esto permite al html reaccionar automáticamente cuando cambia la sesión del usuario
    this.userName$ = this.supabaseService.userName$;
  }

  async logout() {
    await this.supabaseService.signOut();
  }
}
