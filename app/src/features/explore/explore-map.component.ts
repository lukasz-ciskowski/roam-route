import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import type { SharedRoute } from '../../services/explore.service';
import { MapComponent } from '../map/map.component';
import { FullscreenMapDialogComponent } from '../../shared/components/fullscreen-map/fullscreen-map-dialog.component';

@Component({
    selector: 'explore-map',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MapComponent,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
    ],
    templateUrl: './explore-map.component.html',
})
export class ExploreMapComponent {
    initialData = input<SharedRoute>();

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

    constructor(private dialog: MatDialog) {}

    openFullscreenMap(): void {
        if (!this.markersResponse()) return;

        this.dialog.open(FullscreenMapDialogComponent, {
            width: '100%',
            height: '100%',
            maxWidth: '90vw',
            maxHeight: '90vh',
            panelClass: 'fullscreen-dialog',
            data: {
                markersResponse: this.markersResponse(),
            },
        });
    }
}
