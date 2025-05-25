import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { ChatComponent } from '../chat/chat.component';
import type { MarkersResponse } from '../map/types';

@Component({
    selector: 'planner-component',
    standalone: true,
    imports: [CommonModule, MapComponent, ChatComponent],
    templateUrl: './planner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannerComponent {
    markersResponse = signal<MarkersResponse | null>(null);
    isFullscreen = signal(false);

    onUpdateMarkersResponse(markers: MarkersResponse) {
        this.markersResponse.set(markers);
    }

    onFullscreenChange() {
        this.isFullscreen.set(!this.isFullscreen());
    }
}
