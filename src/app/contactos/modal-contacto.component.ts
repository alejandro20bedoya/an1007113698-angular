// Importaciones de Angular necesarias
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

// Importaciones de PrimeNG para la interfaz
import { DialogModule } from 'primeng/dialog';       // Ventana modal
import { ButtonModule } from 'primeng/button';       // Botones estilizados
import { InputTextModule } from 'primeng/inputtext'; // Campos de texto
import { DropdownModule } from 'primeng/dropdown';   // Dropdown para seleccionar entidades

import { HttpClient } from '@angular/common/http';   // Para hacer peticiones HTTP
import Swal from 'sweetalert2';                     // Para alertas bonitas


// Decorador que define el componente
@Component({
    selector: 'app-modal-contacto', // nombre del componente en HTML
    standalone: true,               // componente independiente, no necesita módulo
    imports: [                      // módulos necesarios para usar en este modal
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        DropdownModule
    ],
    templateUrl: './modal-contacto.component.html', // HTML del modal
    styleUrls: ['./modal-contacto.component.css']   // CSS del modal
})
export class ModalContactoComponent implements OnInit, OnChanges {

    // 🔹 Controla si el modal es visible
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    // 🔹 Contacto que se va a crear o editar
    @Input() contacto: any = {};
    @Output() saveContacto = new EventEmitter<any>();

    // 🔹 Lista de entidades para el dropdown
    entidades: any[] = [];
    selectedEntidad: any = null;

    // 🔹 Servicio HTTP para cargar entidades
    private http = inject(HttpClient);


    // Se ejecuta al iniciar el componente
    ngOnInit() {
        this.loadEntidades(); // carga la lista de entidades desde el backend
    }

    // Detecta cambios en las entradas (@Input)
    ngOnChanges(changes: SimpleChanges) {
        if (changes['contacto']) {
            // Selecciona automáticamente la entidad del contacto al editar
            this.selectedEntidad = this.contacto?.entidad_id ?? null;
        }
    }

    // Cargar entidades desde la API
    loadEntidades() {
        this.http.get<any[]>('http://localhost:8000/api/entidades')
            .subscribe({
                next: data => this.entidades = data, // guarda entidades
                error: () => {                       // error al cargar
                    Swal.fire(
                        'Error',
                        'No se pudieron cargar las entidades',
                        'error'
                    );
                }
            });
    }

    // Guardar contacto
    save() {
        //  Validación: debe seleccionar una entidad
        if (!this.selectedEntidad) {
            Swal.fire(
                'Entidad requerida',
                'Debes seleccionar una entidad antes de guardar el contacto.',
                'warning'
            );
            return;
        }

        // 🔹 Asignar la entidad seleccionada al contacto
        this.contacto.entidad_id = this.selectedEntidad;

        // 🔹 Emitir el contacto al componente padre
        this.saveContacto.emit(this.contacto);

        // 🔹 Cerrar modal
        this.close();
    }

    // Cerrar modal desde UI
    hide() {
        this.close();
    }

    // Cerrar modal y avisar al padre
    close() {
        this.visibleChange.emit(false);
    }
}
