// herramientas 
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalContactoComponent } from './modal-contacto.component';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2'; // instalamos sweetalert para las alertas mas dinamicas y interactivas
import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

// Decorador que define el componente, su HTML, CSS, dependencias y servicios
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
  styleUrls: ['./contactos.component.css'],
  providers: [MessageService]
})

// controlador de contactos aca hacemos la logica de los contactos 
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

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('entidadId');
    if (idParam) this.entidadId = Number(idParam);

    this.loadContactos();
  }
  @ViewChild('dt') dt!: Table;


  // CARGAR CONTACTOS
  loadContactos() {
    const url = this.entidadId
      ? `${this.baseUrl}/entidades/${this.entidadId}/contactos`
      : `${this.baseUrl}/contactos`;

    this.http.get<any[]>(url).subscribe({
      next: data => this.contactos = data,
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los contactos', 'error');
      }
    });
  }

  // VOLVER A ENTIDADES
  volverEntidades() {
    this.router.navigate(['/entidades']);
  }


  // ABRIR NUEVO
  openNew() {
    this.contacto = { entidad_id: this.entidadId ?? null };
    this.contactoDialog = true;
  }

  applyFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }


  // EDITAR
  edit(contacto: any) {
    this.contacto = { ...contacto };
    this.contactoDialog = true;
  }

  // ELIMINAR UNO
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

      this.http.delete(`${this.baseUrl}/contactos/${contacto.id}`)
        .subscribe({
          next: () => {
            this.loadContactos();

            Swal.fire(
              'Eliminado!',
              'Contacto eliminado correctamente',
              'success'
            );
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo eliminar el contacto',
              'error'
            );
          }
        });

    });
  }

  // ELIMINAR MÚLTIPLES
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

          Swal.fire(
            'Eliminados!',
            'Contactos eliminados correctamente',
            'success'
          );
        },
        error: () => {
          Swal.fire(
            'Error',
            'Ocurrió un error eliminando contactos',
            'error'
          );
        }
      });

    });
  }

  // GUARDAR / ACTUALIZAR
  saveContactoHandler(contacto: any) {

    const esEdicion = !!contacto.id;

    Swal.fire({
      title: esEdicion ? '¿Actualizar contacto?' : '¿Crear contacto?',
      text: esEdicion
        ? 'Los datos serán actualizados'
        : 'Se registrará un nuevo contacto',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: esEdicion ? 'Sí, actualizar' : 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (!result.isConfirmed) return;

      if (esEdicion) {

        this.http.put(`${this.baseUrl}/contactos/${contacto.id}`, contacto)
          .subscribe({
            next: () => {
              this.loadContactos();
              this.contactoDialog = false;

              Swal.fire(
                'Actualizado!',
                'Contacto actualizado correctamente',
                'success'
              );
            },
            error: () => {
              Swal.fire(
                'Error',
                'No se pudo actualizar el contacto',
                'error'
              );
            }
          });

      } else {

        this.http.post(`${this.baseUrl}/entidades/${contacto.entidad_id}/contactos`, contacto)
          .subscribe({
            next: () => {
              this.loadContactos();
              this.contactoDialog = false;

              Swal.fire(
                'Creado!',
                'Contacto creado correctamente',
                'success'
              );
            },
            error: () => {
              Swal.fire(
                'Error',
                'No se pudo crear el contacto',
                'error'
              );
            }
          });
      }

    });
  }
}
