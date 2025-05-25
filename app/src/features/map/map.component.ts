import { Component, ChangeDetectionStrategy, input, computed, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import type { MarkersResponse } from './types';
import { ShareModalComponent } from './share-modal/share-modal.component';

@Component({
    selector: 'map-component',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './map.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
    markersResponse = input<MarkersResponse>();
    isFullscreen = input(false);
    onFullscreenChange = output<void>();

    private map!: L.Map;
    private routePolyline: L.Polyline | null = null;

    markers = computed(() => {
        const response = this.markersResponse();
        if (response) {
            return response!.markers.map((marker) => L.marker([marker.lat, marker.lng]).bindPopup(marker.name)) || [];
        }
        return [];
    });

    constructor(private dialog: MatDialog) {
        effect(() => {
            const response = this.markersResponse();
            if (!response) return;

            const markers =
                response!.markers.map((marker) => L.marker([marker.lat, marker.lng]).bindPopup(marker.name)) || [];

            this.redefineMarkers(markers);
            setTimeout(() => {
                this.map.invalidateSize();
                this.centerMap(markers);
            }, 0);
            setTimeout(() => {
                this.drawRoutePolyline(response.markers);
            }, 1000);
        });
    }

    ngOnInit(): void {
        this.initMap();
    }

    private initMap() {
        const baseMapURl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
        this.map = L.map('mapContainer').setView([0, 0], 2);
        L.tileLayer(baseMapURl, {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(this.map);
        this.map.attributionControl.setPrefix('');
        this.map.zoomControl.remove();
    }

    private centerMap(markers: L.Marker[]) {
        if (markers.length === 0) return;

        const bounds = L.latLngBounds(markers.map((marker) => marker.getLatLng()));
        this.map.flyToBounds(bounds, {
            padding: [10, 10],
            duration: 1,
            easeLinearity: 0.5,
        });
    }

    private redefineMarkers(markers: L.Marker[]) {
        this.map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                this.map.removeLayer(layer);
            }
        });

        markers.forEach((marker) => {
            marker.addTo(this.map);
        });
    }

    private animateRoutePolyline(latlngs: [number, number][]) {
        if (!this.map) return;
        if (this.routePolyline) {
            this.map.removeLayer(this.routePolyline);
            this.routePolyline = null;
        }
        if (latlngs.length < 2) return;

        const interpolated: [number, number][] = [];
        const stepsPerSegment = 20; // More steps = smoother animation
        for (let i = 0; i < latlngs.length - 1; i++) {
            const [startLat, startLng] = latlngs[i];
            const [endLat, endLng] = latlngs[i + 1];
            for (let step = 0; step < stepsPerSegment; step++) {
                const t = step / stepsPerSegment;
                const lat = startLat + (endLat - startLat) * t;
                const lng = startLng + (endLng - startLng) * t;
                interpolated.push([lat, lng]);
            }
        }
        interpolated.push(latlngs[latlngs.length - 1]);

        let currentIndex = 1;
        this.routePolyline = L.polyline([interpolated[0]], { color: 'blue', weight: 3, dashArray: '5, 10' });
        this.routePolyline.addTo(this.map);

        const animate = () => {
            if (currentIndex >= interpolated.length) return;
            const currentLatLngs = this.routePolyline!.getLatLngs() as L.LatLng[];
            this.routePolyline!.setLatLngs([
                ...currentLatLngs,
                L.latLng(interpolated[currentIndex][0], interpolated[currentIndex][1]),
            ]);
            currentIndex++;
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    private drawRoutePolyline(markers: { lat: number; lng: number }[]) {
        if (!this.map) return;
        if (this.routePolyline) {
            this.map.removeLayer(this.routePolyline);
            this.routePolyline = null;
        }
        if (markers.length < 2) return;
        const latlngs = markers.map((m) => [m.lat, m.lng] as [number, number]);
        this.animateRoutePolyline(latlngs);
    }

    toggleFullscreen(): void {
        this.onFullscreenChange.emit();

        setTimeout(() => {
            this.map.invalidateSize();
        }, 0);
    }

    openShareModal(): void {
        const dialogRef = this.dialog.open(ShareModalComponent, {
            width: '500px',
            panelClass: 'share-dialog',
            data: {
                response: this.markersResponse(),
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Handle the save action here
                console.log('Share data:', result);
            }
        });
    }
}
