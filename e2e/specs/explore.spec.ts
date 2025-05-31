import { expect } from '@playwright/test';
import { test } from '../fixtures/auth.fixture';
import { ExplorePage } from '../page-objects/pages/explore.page';
import { exploreTestService } from '../services/explore.test.service';

test.describe('Explore Page', () => {
    let explorePage: ExplorePage;

    test.beforeEach(async ({ page }) => {
        explorePage = new ExplorePage(page);

        await exploreTestService.clearSharedRoutes();
        await exploreTestService.createTestSharedRoutes();
    });

    test('should display list of routes and navigate to details', async ({ page }) => {
        // Arrange
        await explorePage.goto();

        // Assert initial state
        await explorePage.expectRouteListVisible();
        await explorePage.expectRouteItemsCount(2);

        // Act - click on the first route
        await explorePage.clickOnRoute(0);

        // Assert - we should see the route details
        await explorePage.expectRouteDetails();
        await expect(page.url()).toContain('/explore/');
    });

    test('should filter routes with search', async ({ page }) => {
        // Arrange
        await explorePage.goto();
        await explorePage.expectRouteListVisible();
        await explorePage.expectRouteItemsCount(2);

        // Act - search for Paris
        await explorePage.searchRoutes('Paris');

        // Assert - should only show Paris route
        await explorePage.expectRouteItemsCount(1);
    });

    // test.afterAll(async () => {
    //     await exploreTestService.cleanupSharedRoutes();
    // });
});
