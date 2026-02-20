import { NgModule } from '@angular/core';  // usamos para declarar que este módulo maneja el enrutamiento de la app.
import { RouterModule } from '@angular/router'; // contiene todas las herramientas para navegar entre componentes usando rutas.
import { routes } from './app.routes'; // lista de rutas

// declaraciones de rutas
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
