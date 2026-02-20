import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule], // ✅ solo RouterOutlet y CommonModule
  template: `<router-outlet></router-outlet>`, // renderiza los componentes de las rutas
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'prueba';
}
