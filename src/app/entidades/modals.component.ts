// Importamos funcionalidades de Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importamos componentes de PrimeNG para UI
import { DialogModule } from 'primeng/dialog'; // Ventana modal
import { ButtonModule } from 'primeng/button'; // Botones estilizados
import { InputTextModule } from 'primeng/inputtext'; // Campos de texto

// Importamos la interfaz de Entidad
import { Entidad } from './interfaces/entidad';


// Decorador que define el componente modal
@Component({
    selector: 'app-modal-entidad', // nombre del componente en HTML: <app-modal-entidad>
    standalone: true, // componente independiente, no necesita módulo
    imports: [ // módulos y componentes necesarios para usar en este modal
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule
    ],
    templateUrl: './modals.component.html', // HTML del modal
    styleUrls: ['./modals.component.css'] // Estilos del modal
})

// Clase que controla la lógica de la modal
export class ModalsComponent {

    // 🔹 Propiedad que controla si el modal es visible
    @Input() visible: boolean = false;
    // 🔹 Evento para avisar al componente padre cuando cambie la visibilidad
    @Output() visibleChange = new EventEmitter<boolean>();

    // 🔹 Entidad que se va a crear o editar
    @Input() entidad: Entidad = {} as Entidad;
    // 🔹 Evento para avisar al componente padre cuando se guarde la entidad
    @Output() saveEntidad = new EventEmitter<Entidad>();


    // 🔥 Propiedad computada que detecta si la entidad ya existe (edición)
    get isEdit(): boolean {
        return !!this.entidad?.id; // true si tiene id, false si es nueva
    }

    // 🔹 Método que se ejecuta al guardar la entidad
    onSave() {
        this.saveEntidad.emit(this.entidad); // envía la entidad al padre
        this.close(); // cierra el modal
    }

    // 🔹 Método que se ejecuta al cerrar el modal desde la UI
    onHide() {
      this.close();
    }

    // 🔹 Método privado para cerrar la modal y avisar al padre
    private close() {
        this.visible = false; // oculta el modal
        this.visibleChange.emit(this.visible); // notifica al padre
    }
}

