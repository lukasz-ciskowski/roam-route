import { test } from '../fixtures/auth.fixture';
import { PlannerPage } from '../page-objects/pages/planner.page';
import { test as baseTest, expect } from '@playwright/test';
import { AuthPage } from '../page-objects/pages/auth.page';

// Create an unauthenticated test fixture
const unauthenticatedTest = baseTest.extend({});

test.describe('Planner Page', () => {
    let plannerPage: PlannerPage;

    test.beforeEach(async ({ page }) => {
        plannerPage = new PlannerPage(page);
        // await mockFillInAssistantData(page);
    });

    test('should complete planning flow and share route', async () => {
        // Arrange
        await plannerPage.goto();

        // Act - First message
        await plannerPage.sendChatMessage('Paris');

        // Second message
        await plannerPage.sendChatMessage('3 hours');

        // Third message
        await plannerPage.sendChatMessage('yes');

        // Assert - Final state
        await plannerPage.expectPlannerContentVisible();
        await plannerPage.expectMapVisible();
        await plannerPage.expectShareButtonVisible();

        // Share the route
        await plannerPage.shareRoute();
    });
});

// Test for unauthorized users
unauthenticatedTest.describe('Planner Page - Unauthorized', () => {
    let plannerPage: PlannerPage;
    let authPage: AuthPage;

    unauthenticatedTest.beforeEach(async ({ page }) => {
        plannerPage = new PlannerPage(page);
        authPage = new AuthPage(page);
        // await mockFillInAssistantData(page);
    });

    unauthenticatedTest('should redirect to signin when unauthorized user tries to share route', async ({ page }) => {
        // Arrange
        await plannerPage.goto();

        // Act - Complete the planning flow
        await plannerPage.sendChatMessage('Paris');

        await plannerPage.sendChatMessage('3 hours');

        await plannerPage.sendChatMessage('yes');

        // Assert - Route is generated
        await plannerPage.expectPlannerContentVisible();
        await plannerPage.expectMapVisible();
        await plannerPage.expectShareButtonVisible();

        // Act - Try to share the route
        await page.click(plannerPage['selectors'].shareRouteButton);
        await expect(page.locator(authPage['selectors'].signInForm)).toBeVisible();
    });
});
