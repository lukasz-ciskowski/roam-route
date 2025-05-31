import { Component, ChangeDetectionStrategy, input } from '@angular/core';
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
import { AuthModalComponent } from './auth-modal.component';
import { FullscreenMapDialogComponent } from '../../shared/components/fullscreen-map/fullscreen-map-dialog.component';
import type { MarkersResponse } from '../map/types';
import { MapComponent } from '../map/map.component';
import { AuthClientService } from '../../services/auth-client.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app, auth } from '../../app/firebase/client';

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

    constructor(private dialog: MatDialog, private authService: AuthClientService) {}

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
                isInModal: true,
            },
        });
    }

    openShareModal(): void {
        if (this.authService.isSignedIn()) {
            // User is signed in, open normal share modal
            this.dialog.open(ShareModalComponent, {
                width: '500px',
                panelClass: 'share-dialog',
                data: {
                    response: this.markersResponse(),
                },
            });
        } else {
            // User is not signed in, open auth modal
            this.dialog.open(AuthModalComponent, {
                width: '500px',
                panelClass: 'auth-dialog',
            });
        }
    }
}
