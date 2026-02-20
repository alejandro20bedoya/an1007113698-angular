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
import Swal from 'sweetalert2';

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
    selectedEntidad: any = null;

    private http = inject(HttpClient);

    // =============================
    // INIT
    // =============================
    ngOnInit() {
        this.loadEntidades();
    }

    // =============================
    // DETECTAR CAMBIOS (IMPORTANTE)
    // =============================
    ngOnChanges(changes: SimpleChanges) {
        if (changes['contacto']) {
            this.selectedEntidad = this.contacto?.entidad_id ?? null;
        }
    }

    // =============================
    // CARGAR ENTIDADES
    // =============================
    loadEntidades() {
        this.http.get<any[]>('http://localhost:8000/api/entidades')
            .subscribe({
                next: data => this.entidades = data,
                error: () => {
                    Swal.fire(
                        'Error',
                        'No se pudieron cargar las entidades',
                        'error'
                    );
                }
            });
    }

    // =============================
    // GUARDAR
    // =============================
    save() {

        // 🔴 Validar entidad
        if (!this.selectedEntidad) {
            Swal.fire(
                'Entidad requerida',
                'Debes seleccionar una entidad antes de guardar el contacto.',
                'warning'
            );
            return;
        }

        // 🔹 Asignar entidad al contacto
        this.contacto.entidad_id = this.selectedEntidad;

        // 🔹 Emitir al componente padre
        this.saveContacto.emit(this.contacto);

        this.close();
    }

    // =============================
    // CERRAR
    // =============================
    hide() {
        this.close();
    }

    close() {
        this.visibleChange.emit(false);
    }
}
