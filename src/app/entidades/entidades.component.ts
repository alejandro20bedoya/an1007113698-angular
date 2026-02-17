import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { EntidadesService } from './services/entidades.service';
import { Entidad } from './interfaces/entidad';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: [MessageService]
})
export default class EntidadesComponent {
  public entidadesService = inject(EntidadesService);
  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades: Entidad[]=[];
  
  constructor(){
  }
  openNew() {
    throw new Error('Method not implemented.');
  }
 
  edit(entidad:Entidad){

  }

}
