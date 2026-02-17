import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StateEntidad } from '../interfaces/state-entidad';
import { Entidad } from '../interfaces/entidad';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http = inject(HttpClient)
  url: string = "http://127.0.0.1:8000/api/"
  #state = signal<StateEntidad>({
    loading: true,
    entidades: []
  })

  entidades = computed(() => this.#state().entidades);
  loading = computed(() => this.#state().loading);
  constructor() {
    this.refresh();
  }

  /** Método para refrescar los datos */
  refresh(): void {
    this.#state.set({ loading: true, entidades: [] }) // Actualiza el estado a "cargando" y vacia las entidades
    this.http.get<Entidad[]>(`${this.url}entidades`).subscribe({
      next: (res) => {
        this.#state.set({
          loading: false,
          entidades: res,
        });
      },
      error: (error) => {
        console.error('Error al cargar entidades:', error);
      }
    });

  }
  delete(entidad: Entidad): void {
    this.http.delete<Entidad>(`${this.url}entidades/${entidad.id}`).subscribe({
      next: (res) => {
        this.refresh();
      },
      error: (error) => {
        console.error('Error al eliminar la entidad:', error);
      }
    });
  }
}
