import { Component, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule, Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { EntidadesService } from './services/entidades.service';
import { Entidad } from './interfaces/entidad';
import { ModalsComponent } from './modals.component';

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    ModalsComponent
  ],
  templateUrl: './entidades.component.html',
  styleUrls: ['./entidades.component.css'],
  providers: [MessageService]
})
export class EntidadesComponent {

  @ViewChild('dt') dt!: Table;

  private router = inject(Router);
  public entidadesService = inject(EntidadesService);
  private messageService = inject(MessageService);

  total = computed(() => this.entidadesService.entidades().length);

  selectedEntidades: Entidad[] = [];

  entidadDialog = false;
  entidad: Entidad = {} as Entidad;

  isEditMode = false;

  // ===============================
  // GET ENTIDADES PARA LA TABLA
  // ===============================
  get entidades(): Entidad[] {
    return this.entidadesService.entidades().slice(); // slice fuerza nueva referencia para PrimeNG
  }

  // ===============================
  // FILTRO GLOBAL
  // ===============================
  applyFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }

  // ===============================
  // ABRIR MODAL NUEVO
  // ===============================
  openNew() {
    this.isEditMode = false;
    this.entidad = {
      id: undefined,
      nombrec: '',
      nit: '',
      direccion: '',
      telefono: '',
      email: ''
    };
    this.entidadDialog = true;
  }

  // ===============================
  // ABRIR MODAL PARA EDITAR
  // ===============================
  edit(entidad: Entidad) {
    this.isEditMode = true;
    this.entidad = { ...entidad };
    this.entidadDialog = true;
  }

  // ===============================
  // GUARDAR O ACTUALIZAR DESDE EL MODAL
  // ===============================
  handleSave(entidad: Entidad) {
    const esEdicion = this.isEditMode;

    Swal.fire({
      title: esEdicion ? '¿Actualizar entidad?' : '¿Guardar entidad?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: esEdicion ? 'Sí, actualizar' : 'Sí, guardar'
    }).then(result => {
      if (!result.isConfirmed) return;

      const request = esEdicion
        ? this.entidadesService.update(entidad)
        : this.entidadesService.add(entidad);

      request.subscribe({
        next: (respEntidad: Entidad) => {
          this.entidadDialog = false;

          if (esEdicion) {
            const index = this.entidadesService.entidades().findIndex(e => e.id === respEntidad.id);
            if (index !== -1) this.entidadesService.entidades()[index] = respEntidad;
          } else {
            this.entidadesService.entidades().push(respEntidad);
          }

          if (this.dt) this.dt.reset();

          Swal.fire({
            icon: 'success',
            title: esEdicion ? 'Actualizado!' : 'Guardado!',
            text: esEdicion ? 'Entidad actualizada correctamente' : 'Entidad creada correctamente'
          });
        },
        error: (err) => {
          console.error(err);

          // Si Laravel devuelve error de validación 422
          if (err.status === 422 && err.error.errors) {
            Swal.fire({
              icon: 'warning',
              title: 'Datos duplicados',
              text: 'El nombre, NIT o correo ya existen. Ingresa otros.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema en el servidor.'
            });
          }
        }
      });
    });
  }

  // ===============================
  // ELIMINAR MÚLTIPLES
  // ===============================
  deleteSelected() {
    if (!this.selectedEntidades.length) return;
    const ids = this.selectedEntidades.map(e => e.id!);

    Swal.fire({
      title: '¿Eliminar seleccionadas?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.entidadesService.deleteMultiple(ids).subscribe({
        next: () => {
          this.selectedEntidades.forEach(ent => {
            const index = this.entidadesService.entidades().findIndex(e => e.id === ent.id);
            if (index !== -1) this.entidadesService.entidades().splice(index, 1);
          });
          this.selectedEntidades = [];
          if (this.dt) this.dt.reset();

          Swal.fire('Eliminadas!', 'Entidades eliminadas correctamente.', 'success');
        },
        error: (err) => {
          console.error(err);
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron eliminar las entidades.' });
        }
      });
    });
  }

  // =============================
  // ELIMINAR UNA
  // =============================
  deleteEntidad(entidad: Entidad) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la entidad "${entidad.nombrec}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.entidadesService.delete(entidad).subscribe({
        next: () => {
          this.entidadesService.load();

          Swal.fire({
            title: 'Eliminada!',
            text: 'La entidad fue eliminada correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    });
  }

  // =============================
  // CERRAR MODAL
  // =============================
  hideDialog() {
    this.entidadDialog = false;
  }

  // =============================
  // NAVEGACIÓN
  // =============================
  verContactos(entidad: Entidad) {
    this.router.navigate(['/contactos', entidad.id]);
  }

  verTodosContactos() {
    this.router.navigate(['/contactos']);
  }

}