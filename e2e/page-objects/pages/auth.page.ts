import { Page, expect } from '@playwright/test';

export class AuthPage {
    constructor(private page: Page) {}

    private selectors = {
        signInForm: '[data-testid="signin-form"]',
        emailInput: '[data-testid="email-input"]',
        passwordInput: '[data-testid="password-input"]',
        signInButton: '[data-testid="signin-button"]',
        signUpButton: '[data-testid="signup-button"]',
        errorMessage: '[data-testid="signin-error"]',
    };

    async goto() {
        await this.page.goto('/signin');
    }

    async signIn(email: string, password: string) {
        await this.page.waitForLoadState('networkidle');

        await this.page.fill(this.selectors.emailInput, email);
        await this.page.fill(this.selectors.passwordInput, password);
        await this.page.click(this.selectors.signInButton);
    }

    async expectAuthError() {
        await expect(this.page.locator(this.selectors.errorMessage)).toBeVisible();
    }

    async expectSuccessfulAuth() {
        // After successful auth, we should be redirected to the planner page
        await expect(this.page).toHaveURL('/');
    }
}
