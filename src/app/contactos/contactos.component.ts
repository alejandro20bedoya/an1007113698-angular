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
import { FormsModule } from '@angular/forms'; 
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // <-- necesario para [(ngModel)]
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

  // Buscador potente
  searchText = '';

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

  // Getter de contactos filtrados
  get contactosFiltrados(): any[] {
    if (!this.searchText) return this.contactos.slice();
    const text = this.searchText.toLowerCase().trim();

    return this.contactos.filter(c =>
      (c.nombre?.toLowerCase().includes(text) ?? false) ||
      (c.identificacion?.toLowerCase().includes(text) ?? false) ||
      (c.correo?.toLowerCase().includes(text) ?? false) ||
      (c.telefono?.toLowerCase().includes(text) ?? false) ||
      (c.cargo?.toLowerCase().includes(text) ?? false) ||
      (c.entidad?.nombrec?.toLowerCase().includes(text) ?? false)
    );
  }

  // Load y demás métodos existentes
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
    }).then(result => {
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
    }).then(result => {
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
    const esEdicion = !!contacto.id;

    const action$ = esEdicion
      ? this.http.put(`${this.baseUrl}/contactos/${contacto.id}`, contacto)
      : this.http.post(`${this.baseUrl}/entidades/${contacto.entidad_id}/contactos`, contacto);

    action$.subscribe({
      next: () => {
        this.loadContactos();
        this.contactoDialog = false;
        Swal.fire(esEdicion ? 'Actualizado!' : 'Creado!', esEdicion ? 'Contacto actualizado correctamente' : 'Contacto creado correctamente', 'success');
      },
      error: err => {
        this.contactoDialog = false;
        Swal.fire('Error', 'Ocurrió un problema creando o actualizando el contacto', 'error');
      }
    });
  }

  volverEntidades() {
    this.router.navigate(['/entidades']);
  }
}