import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareModalComponent } from './share-modal.component';
import type { MarkersResponse } from '../map/types';
import { MapComponent } from '../map/map.component';

@Component({
    selector: 'planner-map',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MapComponent,
    ],
    templateUrl: './planner-map.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannerMapComponent {
    markersResponse = input<MarkersResponse>();
    isFullscreen = input(false);
    onFullscreenChange = output<void>();

    constructor(private dialog: MatDialog) {}

    toggleFullscreen(): void {
        this.onFullscreenChange.emit();
    }

    openShareModal(): void {
        this.dialog.open(ShareModalComponent, {
            width: '500px',
            panelClass: 'share-dialog',
            data: {
                response: this.markersResponse(),
            },
        });
    }
}
