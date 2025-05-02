import { Component, signal } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { MapComponent } from '../map/map.component';
import type { MarkersResponse } from '../map/types';

@Component({
    selector: 'planner-component',
    standalone: true,
    templateUrl: './planner.component.html',
    imports: [ChatComponent, MapComponent],
})
export class PlannerComponent {
    markersSuggestions = signal<MarkersResponse | null>(null);

    updateMarkers(markers: MarkersResponse) {
        this.markersSuggestions.set(markers);
    }
}
