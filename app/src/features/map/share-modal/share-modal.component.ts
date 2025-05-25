import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { actions } from 'astro:actions';
import type { MarkersResponse } from '../types';

interface ShareModalData {
    response: MarkersResponse;
}

@Component({
    selector: 'share-modal',
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
    ],
    templateUrl: './share-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareModalComponent {
    private dialogRef = inject(MatDialogRef<ShareModalComponent>);
    data: ShareModalData = inject(MAT_DIALOG_DATA);
    form: FormGroup;
    isGenerating = signal(false);
    isSaving = signal(false);
    errorMessage = signal<string | null>(null);
    imageUrl = signal<string | null>(null);

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            title: [`Amazing journey to ${this.data.response.city}`],
            description: [''],
            messages: [this.data.response],
            imageUrl: ['', [Validators.pattern('https?://.+')]],
        });

        // Subscribe to imageUrl changes
        this.form.get('imageUrl')?.valueChanges.subscribe((url: string) => {
            if (url && this.form.get('imageUrl')?.valid) {
                this.imageUrl.set(url);
            } else {
                this.imageUrl.set(null);
            }
        });
    }

    removeImage(): void {
        this.form.patchValue({ imageUrl: '' });
        this.imageUrl.set(null);
    }

    async onSave(): Promise<void> {
        if (!this.form.valid || this.isSaving()) return;
        if (!this.data.response.city || !this.data.response.country) {
            this.errorMessage.set('City and country are required');
            return;
        }

        this.isSaving.set(true);
        this.errorMessage.set(null);

        try {
            const response = await actions.shareRoute({
                title: this.form.value.title,
                description: this.form.value.description,
                city: this.data.response.city,
                country: this.data.response.country,
                places: this.data.response.markers.map((place) => ({
                    name: place.name,
                    lat: place.lat,
                    lng: place.lng,
                })),
                imageUrl: this.form.value.imageUrl || undefined,
            });

            if (response?.error) {
                throw new Error(response.error.message || 'Failed to share route');
            }

            this.dialogRef.close(response.data);
        } catch (error) {
            console.error('Failed to share route:', error);
            this.errorMessage.set(error instanceof Error ? error.message : 'Failed to share route');
        } finally {
            this.isSaving.set(false);
        }
    }

    async generateDescription(): Promise<void> {
        if (this.isGenerating()) return;
        if (!this.data.response.city || !this.data.response.country) {
            this.errorMessage.set('City and country are required');
            return;
        }

        this.isGenerating.set(true);
        this.errorMessage.set(null);

        try {
            const response = await actions.generateRouteDescription({
                city: this.data.response.city,
                country: this.data.response.country,
                places: this.data.response.markers.map((marker) => marker.name),
            });

            if (response?.error) {
                throw new Error(response.error.message || 'Failed to generate description');
            }

            this.form.patchValue({ description: response.data });
        } catch (error) {
            console.error('Failed to generate description:', error);
            this.errorMessage.set(error instanceof Error ? error.message : 'Failed to generate description');
        } finally {
            this.isGenerating.set(false);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
