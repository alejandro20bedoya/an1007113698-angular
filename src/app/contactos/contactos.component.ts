import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { TableModule, Table } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalContactoComponent } from './modal-contacto.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    ToolbarModule,
    ToastModule,
    ModalContactoComponent
  ],
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {

  contactos: any[] = [];
  selectedContactos: any[] = [];
  contactoDialog: boolean = false;
  contacto: any = {};
  entidadId?: number;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8000/api';

  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('entidadId');
    if (idParam) this.entidadId = Number(idParam);
    this.loadContactos();
  }

  loadContactos() {
    const url = this.entidadId
      ? `${this.baseUrl}/entidades/${this.entidadId}/contactos`
      : `${this.baseUrl}/contactos`;

    this.http.get<any[]>(url).subscribe({
      next: data => this.contactos = data,
      error: () => Swal.fire('Error', 'No se pudieron cargar los contactos', 'error')
    });
  }

  openNew() {
    this.contacto = {
      nombre: '',
      identificacion: '',
      telefono: '',
      correo: '',
      cargo: '',
      entidad_id: this.entidadId ?? null
    };
    this.contactoDialog = true;
  }

  edit(contacto: any) {
    // 🔹 Solo copiamos los datos actuales
    this.contacto = { ...contacto };
    this.contactoDialog = true;
  }

  delete(contacto: any) {
    if (!contacto.id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el contacto "${contacto.nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.http.delete(`${this.baseUrl}/contactos/${contacto.id}`).subscribe({
        next: () => {
          this.loadContactos();
          Swal.fire('Eliminado!', 'Contacto eliminado correctamente', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo eliminar el contacto', 'error')
      });
    });
  }

  deleteSelected() {
    if (!this.selectedContactos.length) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminarán ${this.selectedContactos.length} contactos`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      const requests = this.selectedContactos.map(c =>
        this.http.delete(`${this.baseUrl}/contactos/${c.id}`)
      );

      forkJoin(requests).subscribe({
        next: () => {
          this.loadContactos();
          this.selectedContactos = [];
          Swal.fire('Eliminados!', 'Contactos eliminados correctamente', 'success');
        },
        error: () => Swal.fire('Error', 'Ocurrió un error eliminando contactos', 'error')
      });
    });
  }

  saveContactoHandler(contacto: any) {
    console.log('Enviando contacto:', contacto);

    const esEdicion = !!contacto.id;

    const action$ = esEdicion
      ? this.http.put(`${this.baseUrl}/contactos/${contacto.id}`, contacto)
      : this.http.post(`${this.baseUrl}/entidades/${contacto.entidad_id}/contactos`, contacto);

    action$.subscribe({
      next: () => {
        this.loadContactos();
        this.contactoDialog = false;

        setTimeout(() => {
          Swal.fire(
            esEdicion ? 'Actualizado!' : 'Creado!',
            esEdicion
              ? 'Contacto actualizado correctamente'
              : 'Contacto creado correctamente',
            'success'
          );
        }, 100);
      },
      error: (err) => {
        this.contactoDialog = false;

        // 🔹 Validación de backend
        if (err.status === 422) {
          const errors = err.error.errors;
          const messages: string[] = [];

          // Recorrer todos los campos que devuelven error
          if (errors) {
            for (const key of Object.keys(errors)) {
              messages.push(...errors[key]);
            }
          }

          // Mostrar alerta con todos los mensajes
          Swal.fire('Errores de validación', messages.join('\n'), 'warning');
        } else if (err.status === 500) {
          // Errores del servidor
          Swal.fire('Error', err.error?.message || 'Ocurrió un problema en el servidor.', 'error');
        } else {
          Swal.fire(
            'Error',
            esEdicion
              ? 'No se pudo actualizar el contacto'
              : 'No se pudo crear el contacto',
            'error'
          );
        }
      }
    });
  }

  applyFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  volverEntidades() {
    this.router.navigate(['/entidades']);
  }
}