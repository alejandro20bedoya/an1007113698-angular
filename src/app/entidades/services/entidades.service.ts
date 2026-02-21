import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Entidad } from '../interfaces/entidad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http = inject(HttpClient);
  private url = 'http://127.0.0.1:8000/api/entidades';

  // Signal para almacenar entidades
  entidades = signal<Entidad[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    this.load();
  }

  // CARGAR TODAS LAS ENTIDADES
  load() {
    this.loading.set(true);

    this.http.get<Entidad[]>(this.url)
      .subscribe({
        next: (data: Entidad[]) => {
          this.entidades.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error cargando entidades', err);
          this.loading.set(false);
        }
      });
  }

  // AGREGAR ENTIDAD
  add(entidad: Entidad): Observable<Entidad> {
    return this.http.post<Entidad>(this.url, entidad);
  }

  // ACTUALIZAR ENTIDAD
  update(entidad: Entidad): Observable<Entidad> {
    return this.http.put<Entidad>(`${this.url}/${entidad.id}`, entidad);
  }

  // ELIMINAR ENTIDAD
  delete(entidad: Entidad): Observable<void> {
    return this.http.delete<void>(`${this.url}/${entidad.id}`);
  }

  // ELIMINAR MÚLTIPLES ENTIDADES
  deleteMultiple(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.url}/delete-multiple`, { ids });
  }

  // ESTADO DE CARGA
  loadingState(): boolean {
    return this.loading();
  }
}