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

  // 🔥 REFERENCIA A LA TABLA
  @ViewChild('dt') dt!: Table;

  // Método para filtros individuales
  applyColumnFilter(value: string, field: string) {
    this.dt.filter(value, field, 'contains');
  }


  public entidadesService = inject(EntidadesService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  total = computed(() => this.entidadesService.entidades().length);

  selectedEntidades: Entidad[] = [];

  entidadDialog = false;
  entidad: Entidad = {} as Entidad;

  // 🔥 BUSCADOR GLOBAL// 🔥 BUSCADOR GLOBAL
  applyFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }



  // =============================
  // ABRIR MODAL NUEVO
  // =============================
  openNew() {
    this.entidad = {} as Entidad;
    this.entidadDialog = true;
  }

  // =============================
  // EDITAR
  // =============================
  edit(entidad: Entidad) {
    this.entidad = { ...entidad };
    this.entidadDialog = true;
  }

  // =============================
  // GUARDAR / ACTUALIZAR
  // =============================
  save(entidad: Entidad) {

    const esEdicion = !!entidad.id;

    if (!entidad.nombrec || !entidad.nit) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obligatorios',
        text: 'Nombre y NIT son obligatorios'
      });
      return;
    }

    Swal.fire({
      title: esEdicion ? '¿Estás seguro?' : '¿Deseas guardar?',
      text: esEdicion
        ? 'La entidad será actualizada'
        : 'La entidad será registrada',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: esEdicion ? 'Sí, actualizar' : 'Sí, guardar'
    }).then((result) => {

      if (!result.isConfirmed) return;

      const request = esEdicion
        ? this.entidadesService.update(entidad)
        : this.entidadesService.add(entidad);

      request.subscribe({
        next: () => {

          this.entidadesService.load();

          Swal.fire(
            esEdicion ? 'Actualizado!' : 'Guardado!',
            esEdicion
              ? 'Entidad actualizada correctamente'
              : 'Entidad creada correctamente',
            'success'
          );

          this.entidadDialog = false;
        },
        error: (error) => {
          if (error.status === 422) {
            Swal.fire({
              icon: 'error',
              title: 'Error de validación',
              text: 'Revisa los campos obligatorios'
            });
          }
        }
      });

    });
  }

  // =============================
  // ELIMINAR MÚLTIPLES
  // =============================
  deleteSelected() {

    if (!this.selectedEntidades.length) return;

    const ids = this.selectedEntidades.map(e => e.id!);

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminarán ${ids.length} entidad(es)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.entidadesService.deleteMultiple(ids).subscribe({
        next: () => {

          this.entidadesService.load();
          this.selectedEntidades = [];

          Swal.fire(
            'Eliminadas!',
            'Las entidades fueron eliminadas correctamente.',
            'success'
          );
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
