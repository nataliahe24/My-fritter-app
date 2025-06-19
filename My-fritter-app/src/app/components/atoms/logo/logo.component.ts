import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() alt: string = 'Mi Buñuelo Cúcuta';
  @Input() src: string = 'assets/images/mi-bunuelo-cucuta-logo.png';
} 