import { expect, test } from '@playwright/test';
import { AuthPage } from '../page-objects/pages/auth.page';

test.describe('Authentication', () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
    });

    test('should allow user to sign in with valid credentials', async () => {
        await authPage.goto();

        await authPage.signIn(process.env.TEST_USER_EMAIL || '', process.env.TEST_USER_PASSWORD || '');

        await authPage.expectSuccessfulAuth();
    });

    test('should show error with invalid credentials', async () => {
        await authPage.goto();

        await authPage.signIn('invalid@email.com', 'wrongpassword');

        await authPage.expectAuthError();
    });

    test('should not allow access to protected routes without authentication', async ({ page }) => {
        await page.goto('/planner');

        await expect(page.url()).toContain('/signin');
    });
});
