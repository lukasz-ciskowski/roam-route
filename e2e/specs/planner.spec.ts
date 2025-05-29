import { test } from '../fixtures/auth.fixture';
import { PlannerPage } from '../page-objects/pages/planner.page';

test.describe('Planner Page', () => {
    let plannerPage: PlannerPage;

    test.beforeEach(async ({ page }) => {
        plannerPage = new PlannerPage(page);
    });

    test('should complete planning flow and share route', async () => {
        // Arrange
        await plannerPage.goto();
        await plannerPage.expectChatComponentVisible();
        await plannerPage.expectAssistantResponseToBeVisible();

        // Act - First message
        await plannerPage.sendChatMessage('Paris');
        // Wait for the assistant's response
        await plannerPage.expectAssistantResponseToBeVisible();

        // Second message
        await plannerPage.sendChatMessage('3 hours');
        await plannerPage.expectAssistantResponseToBeVisible();

        // Third message
        await plannerPage.sendChatMessage('yes');
        await plannerPage.expectAssistantResponseToBeVisible();

        // Assert - Final state
        await plannerPage.expectPlannerContentVisible();
        await plannerPage.expectMapVisible();
        await plannerPage.expectShareButtonVisible();

        // Share the route
        await plannerPage.shareRoute();
    });
});
