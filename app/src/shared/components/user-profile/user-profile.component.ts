import { Component, Input, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthClientService } from '../../../services/auth-client.service';
import type { User } from 'firebase/auth';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
})
export class UserProfileComponent {
    initialUser = input<User | null>(null);

    private authService = inject(AuthClientService);

    data = computed(() => {
        if (this.authService.isLoading() || typeof window === 'undefined') {
            return {
                user: this.initialUser(),
            };
        }
        return {
            user: this.authService.currentUser(),
        };
    });
}
