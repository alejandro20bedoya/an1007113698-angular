// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta para mostrar todos los contactos
  {
    path: 'contactos',
    loadComponent: () =>
      import('./contactos/contactos.component').then(m => m.ContactosComponent)
  },

  // Ruta para mostrar contactos de una entidad específica
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

  // Ruta por defecto
  {
    path: '',
    redirectTo: 'entidades',
    pathMatch: 'full'
  }
];
