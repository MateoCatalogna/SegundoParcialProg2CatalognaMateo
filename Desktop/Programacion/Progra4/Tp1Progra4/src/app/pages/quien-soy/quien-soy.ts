import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl:'./quien-soy.css'
})
export class QuienSoy {
  user: any = null;
  loading = true;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDatos().subscribe({
      next: (res) => {
        this.user = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los datos de GitHub.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
