import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { Entidad } from './interfaces/entidad';

@Component({
  selector: 'app-modal-entidad',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnChanges {

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() entidad: Entidad = {} as Entidad;
  @Output() saveEntidad = new EventEmitter<Entidad>();

  entidadLocal: Entidad = {} as Entidad;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.entidadLocal = this.entidad ? { ...this.entidad } : {} as Entidad;
    }
  }

  onSave() {
    this.saveEntidad.emit({ ...this.entidadLocal });
    this.visibleChange.emit(false);
  }

  onHide() {
    this.visibleChange.emit(false);
  }
}