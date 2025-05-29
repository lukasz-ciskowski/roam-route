import { Locator, Page, expect } from '@playwright/test';

export class ExplorePage {
    constructor(private page: Page) {}

    private selectors = {
        routeList: '[data-testid="route-list"]',
        routeItem: '[data-testid="route-item"]',
        searchInput: '[data-testid="search-input"]',
        placesToVisit: '[data-testid="places-to-visit"]',
    };

    async goto() {
        await this.page.goto('/explore');
    }

    async expectRouteListVisible() {
        await this.page.waitForSelector(this.selectors.routeList, { state: 'visible' });
    }

    async expectRouteItemsCount(count: number) {
        await expect(this.page.locator(this.selectors.routeItem)).toHaveCount(count);
    }

    async clickOnRoute(index: number) {
        await this.page.locator(this.selectors.routeItem).nth(index).click();
    }

    async searchRoutes(searchTerm: string) {
        await this.page.fill(this.selectors.searchInput, searchTerm);
        // Wait for the search to complete - there will be a network request
        await this.page.waitForLoadState('networkidle');
    }

    async expectRouteDetails() {
        await this.page.waitForSelector(this.selectors.placesToVisit, { state: 'visible' });
    }
}
