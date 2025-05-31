import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthTabsComponent } from '../auth/auth-tabs.component';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'auth-modal',
    standalone: true,
    imports: [CommonModule, MatDialogModule, AuthTabsComponent, MatIconModule],
    templateUrl: './auth-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
    constructor(private dialogRef: MatDialogRef<AuthModalComponent>) {}

    closeDialog(): void {
        this.dialogRef.close();
    }

    handleAuthorized(isAuthorized: boolean): void {
        if (isAuthorized) {
            this.dialogRef.close(true);
        }
    }
}
