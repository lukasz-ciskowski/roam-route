import { Component, ChangeDetectionStrategy, input, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import type { MarkersResponse } from './types';

@Component({
    selector: 'map-component',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './map.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
    markersSuggestion = input<MarkersResponse>();

    private map!: L.Map;
    private routePolyline: L.Polyline | null = null;
    markers = computed(() => {
        const markersSuggestion = this.markersSuggestion();

        if (markersSuggestion) {
            return (
                markersSuggestion!.markers.map((marker) => L.marker([marker.lat, marker.lng]).bindPopup(marker.name)) ||
                []
            );
        }
        return [];
    });

    constructor() {
        effect(() => {
            const markersSuggestion = this.markersSuggestion();
            if (!markersSuggestion) return;

            const markers =
                markersSuggestion!.markers.map((marker) => L.marker([marker.lat, marker.lng]).bindPopup(marker.name)) ||
                [];

            this.redefineMarkers(markers);
            this.centerMap(markers);
            setTimeout(() => {
                this.drawRoutePolyline(markersSuggestion.markers);
            }, 1000);
        });
    }

    ngOnInit(): void {
        this.initMap();
    }

    // ngAfterViewInit() {
    //     this.initMap();
    // }

    private initMap() {
        const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.map = L.map('mapContainer').setView([0, 0], 2);
        L.tileLayer(baseMapURl).addTo(this.map);
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
}
