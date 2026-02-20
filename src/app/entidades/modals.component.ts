import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Entidad } from './interfaces/entidad';

@Component({
    selector: 'app-modal-entidad',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule
    ],
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.css']
})
export class ModalsComponent {

    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() entidad: Entidad = {} as Entidad;
    @Output() saveEntidad = new EventEmitter<Entidad>();

    // 🔥 Detecta si es edición
    get isEdit(): boolean {
        return !!this.entidad?.id;
    }

    onSave() {
        this.saveEntidad.emit(this.entidad);
        this.close();
    }

    onHide() {
      this.close();
    }

    private close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }
}
