// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta para contactos
  {
    path: 'contactos',
    loadComponent: () =>
      import('./contactos/contactos.component').then(m => m.ContactosComponent)
  },
  {
    path: 'contactos/:entidadId',
    loadComponent: () =>
      import('./contactos/contactos.component').then(m => m.ContactosComponent)
  },
  // Ruta para entidades
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