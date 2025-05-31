import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthTabsComponent } from './auth-tabs.component';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [AuthTabsComponent, MatCardModule],
    templateUrl: './auth.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
    handleAuthorized(isAuthorized: boolean): void {
        if (isAuthorized) {
            window.location.href = '/';
        }
    }
}
