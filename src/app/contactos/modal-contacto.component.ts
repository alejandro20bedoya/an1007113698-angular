import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient } from '@angular/common/http';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-modal-contacto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule
  ],
  templateUrl: './modal-contacto.component.html',
  styleUrls: ['./modal-contacto.component.css']
})
export class ModalContactoComponent implements OnInit, OnChanges {

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() contacto: any = {};
  @Output() saveContacto = new EventEmitter<any>();

  entidades: any[] = [];
  selectedEntidad: number | null = null;

  private http = inject(HttpClient);

  ngOnInit() {
    this.loadEntidades();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contacto'] && this.contacto) {
      this.selectedEntidad = this.contacto.entidad_id ?? null;
    }
  }

  loadEntidades() {
    this.http.get<any[]>('http://localhost:8000/api/entidades')
      .subscribe({
        next: data => this.entidades = data,
        error: () => this.showAlert('error', 'Error', 'No se pudieron cargar las entidades')
      });
  }

  save() {

    if (!this.selectedEntidad) {
      this.showAlert('warning', 'Entidad requerida', 'Debes seleccionar una entidad');
      return;
    }

    if (!this.contacto.nombre?.trim()) {
      this.showAlert('warning', 'Nombre requerido', 'Debes ingresar el nombre');
      return;
    }

    if (!this.contacto.identificacion?.trim()) {
      this.showAlert('warning', 'Identificación requerida', 'Debes ingresar la identificación');
      return;
    }

    if (!this.contacto.correo?.trim()) {
      this.showAlert('warning', 'Correo requerido', 'Debes ingresar el correo');
      return;
    }

    if (!this.contacto.telefono?.trim()) {
      this.showAlert('warning', 'Teléfono requerido', 'Debes ingresar el teléfono');
      return;
    }

    if (!this.contacto.cargo?.trim()) {
      this.showAlert('warning', 'Cargo requerido', 'Debes ingresar el cargo');
      return;
    }

    // Asignamos el id seleccionado
    this.contacto.entidad_id = this.selectedEntidad;

    // 🔹 Cerramos el modal inmediatamente
    this.visible = false;
    this.visibleChange.emit(false);

    // 🔹 Emitimos el contacto al padre
    this.saveContacto.emit(this.contacto);
  }

  hide() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  showAlert(icon: SweetAlertIcon, title: string, text: string) {
    return Swal.fire({
      icon,
      title,
      text,
      customClass: { popup: 'swal-zindex' }
    });
  }
}