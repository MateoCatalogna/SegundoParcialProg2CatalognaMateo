import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  userName = 'Invitado';
  loggedIn = false;

  constructor(private supabase: SupabaseService, private router: Router) {}

  ngOnInit() {
    // Suscribirse al observable del usuario
    this.supabase.user$.subscribe((user: User | null) => {
      this.loggedIn = !!user; // !!user convierte el objeto en booleano. primer ! =truthy o falsy, segundo boolean oreal
    });

    // Suscribirse al observable del nombre
    this.supabase.userName$.subscribe((name: string | null) => { 
      this.userName = name ?? 'Invitado'; // si name es null, se asigna 'Invitado'. verifica si el valor de la izquierda es null o undefined
    });
  }

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/home']);
  }


}
