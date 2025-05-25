import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import type { SharedRoute } from '../../services/explore.service';

@Component({
    selector: 'places-to-visit',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatListModule],
    templateUrl: './places-to-visit.component.html',
})
export class PlacesToVisitComponent {
    initialData = input<SharedRoute>();
}
