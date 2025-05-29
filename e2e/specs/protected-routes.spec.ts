import { expect } from '@playwright/test';
import { test } from '../fixtures/auth.fixture';

test.describe('Protected Routes', () => {
    test('should access protected route directly', async ({ page }) => {
        // Try to access a protected route
        await page.goto('/planner');

        // We should stay on the planner page since we're authenticated
        expect(page.url()).toContain('/planner');
    });
});
