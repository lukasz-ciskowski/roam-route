import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import type { SharedRoute } from '../../services/explore.service';

@Component({
    selector: 'route-details-component',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatListModule],
    templateUrl: './route-details.component.html',
})
export class RouteDetailsComponent {
    initialData = input<SharedRoute>();
}
