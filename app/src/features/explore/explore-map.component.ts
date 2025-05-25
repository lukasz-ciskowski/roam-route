import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import type { SharedRoute } from '../../services/explore.service';
import { MapComponent } from '../map/map.component';

@Component({
    selector: 'explore-map',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatListModule, MapComponent, MatIconModule, MatButtonModule],
    templateUrl: './explore-map.component.html',
})
export class ExploreMapComponent {
    initialData = input<SharedRoute>();
    isFullscreen = signal(false);

    markersResponse = computed(() => {
        const data = this.initialData();
        if (!data) return null;

        return {
            markers: data.places.map((place) => ({
                name: place.name,
                lat: place.lat,
                lng: place.lng,
            })),
        };
    });

    toggleFullscreen() {
        this.isFullscreen.update((value) => !value);
    }
}
