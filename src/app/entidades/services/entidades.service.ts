import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Entidad } from '../interfaces/entidad';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {

  private http = inject(HttpClient);
  private url = 'http://127.0.0.1:8000/api/entidades';

  entidades = signal<Entidad[]>([]);
  loading = signal<boolean>(false); // 🔥 AGREGAR ESTO

  constructor() {
    this.load();
  }

  // ===============================
  // CARGAR TODAS
  // ===============================
  load() {

    this.loading.set(true); // 🔥 activar loading

    this.http.get<Entidad[]>(this.url)
      .subscribe({
        next: (data) => {
          this.entidades.set(data);
          this.loading.set(false); // 🔥 desactivar loading
        },
        error: (err) => {
          console.error('Error cargando entidades', err);
          this.loading.set(false); // 🔥 desactivar también en error
        }
      });
  }

  add(entidad: Entidad) {
    return this.http.post<Entidad>(this.url, entidad);
  }

  update(entidad: Entidad) {
    return this.http.put(`${this.url}/${entidad.id}`, entidad);
  }

  delete(entidad: Entidad) {
    return this.http.delete(`${this.url}/${entidad.id}`);
  }

  deleteMultiple(ids: number[]) {
    return this.http.post(`${this.url}/delete-multiple`, { ids });
  }

}
