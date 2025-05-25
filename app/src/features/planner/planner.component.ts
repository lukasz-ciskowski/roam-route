import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';
import type { MarkersResponse } from '../map/types';
import { PlannerMapComponent } from './planner-map.component';

@Component({
    selector: 'planner-component',
    standalone: true,
    imports: [CommonModule, PlannerMapComponent, ChatComponent],
    templateUrl: './planner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannerComponent {
    markersResponse = signal<MarkersResponse | null>(null);

    onUpdateMarkersResponse(markers: MarkersResponse) {
        this.markersResponse.set(markers);
    }
}
