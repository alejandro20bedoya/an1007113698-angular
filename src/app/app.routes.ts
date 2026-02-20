// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta para mostrar todos los contactos
  {
    path: 'contactos',
    loadComponent: () =>
      import('./contactos/contactos.component').then(m => m.ContactosComponent)
  },

  // parametro dinamico en la url se activa cuando se pasa el id de la entidad 
  // ejemplo: http://localhost:4200/contactos/1
  {
    path: 'contactos/:entidadId',
    loadComponent: () =>
      import('./contactos/contactos.component').then(m => m.ContactosComponent)
  },

  // Ruta de entidades 
  {
    path: 'entidades',
    loadComponent: () =>
      import('./entidades/entidades.component').then(m => m.EntidadesComponent)
  },

  // Ruta por defecto es la que se va a mostrar cuando la app arranque por primera vez 
  // por eso no mostraba el listado de entidades porque no estaba cargado y estaba cargando el index
  {
    path: '',
    redirectTo: 'entidades',
    pathMatch: 'full'
  }
];
