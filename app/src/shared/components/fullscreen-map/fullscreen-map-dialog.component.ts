import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MapComponent } from '../../../features/map/map.component';
import type { MarkersResponse } from '../../../features/map/types';

interface ShareModalData {
    markersResponse: MarkersResponse;
}

@Component({
    selector: 'fullscreen-map-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MapComponent],
    template: `
        <div class="relative w-full h-full">
            <map-component [markersResponse]="data.markersResponse" isInModal="true" />
            <div class="absolute top-2 right-2">
                <button mat-mini-fab color="primary" (click)="close()">
                    <mat-icon>fullscreen_exit</mat-icon>
                </button>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullscreenMapDialogComponent {
    dialogRef = inject(MatDialogRef<FullscreenMapDialogComponent>);
    data: ShareModalData = inject(MAT_DIALOG_DATA);

    close(): void {
        this.dialogRef.close();
    }
}
