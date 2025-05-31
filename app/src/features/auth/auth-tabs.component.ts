import { Component, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
    selector: 'app-auth-tabs',
    standalone: true,
    imports: [MatTabsModule, SigninComponent, SignupComponent],
    templateUrl: './auth-tabs.component.html',
})
export class AuthTabsComponent {
    onAuthorized = output<boolean>();

    activeTabIndex = 0;

    constructor() {}

    setActiveTab(index: number): void {
        this.activeTabIndex = index;
    }

    handleAuthorized(isAuthorized: boolean): void {
        this.onAuthorized.emit(isAuthorized);
    }
}
