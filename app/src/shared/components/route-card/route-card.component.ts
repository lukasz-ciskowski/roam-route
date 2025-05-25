import { Component, input, Input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-route-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    templateUrl: './route-card.component.html',
})
export class RouteCardComponent {
    icon = input<string>('');
    iconClass = input<string>('');
    title = input<string>('');
    description = input<string>('');
    imageUrl = input<string | undefined>(undefined);
}
