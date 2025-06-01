import { Page, expect } from '@playwright/test';

export class PlannerPage {
    constructor(private page: Page) {}

    private selectors = {
        chatComponent: '[data-testid="chat-component"]',
        chatInput: '[data-testid="chat-input"]',
        chatSendButton: '[data-testid="chat-send-button"]',
        chatMessagesArea: '[data-testid="chat-messages-area"]',
        plannerContent: '[data-testid="planner-content"]',
        plannerMapComponent: '[data-testid="planner-map-component"]',
        plannerMapContainer: '[data-testid="planner-map-container"]',
        plannerMapElement: '[data-testid="planner-map-element"]',
        shareRouteButton: '[data-testid="share-route-button"]',
        aiTypingIndicator: '[data-testid="ai-typing-indicator"]',
        chatError: '[data-testid="chat-error"]',
        assistantMessage: '[data-testid="assistant-message"]',
        shareTitleInput: '[data-testid="share-title-input"]',
        shareDescriptionInput: '[data-testid="share-description-input"]',
        generateDescriptionButton: '[data-testid="generate-description-button"]',
        shareImageUrlInput: '[data-testid="share-image-url-input"]',
        shareSaveButton: '[data-testid="share-save-button"]',
        shareErrorMessage: '[data-testid="share-error-message"]',
    };

    async goto() {
        await this.page.goto('/planner');
    }

    async sendChatMessage(message: string) {
        await this.page.waitForTimeout(500); // Wait for the UI to be ready
        await this.page.fill(this.selectors.chatInput, message);
        await this.page.click(this.selectors.chatSendButton);
    }

    async shareRoute(title: string = 'Test Route', description: string = 'Test Description') {
        await this.page.click(this.selectors.shareRouteButton);

        // Wait for the share modal to be visible and fill in the form
        await this.page.waitForTimeout(500); // Wait for modal animation
        await this.page.fill(this.selectors.shareTitleInput, title);

        // Click generate description if no description is provided
        if (!description) {
            await this.page.click(this.selectors.generateDescriptionButton);
            await this.page.waitForSelector(`${this.selectors.shareDescriptionInput}:not(:empty)`, { timeout: 10000 });
        } else {
            await this.page.fill(this.selectors.shareDescriptionInput, description);
        }

        // Submit the form
        await this.page.click(this.selectors.shareSaveButton);

        await this.page.waitForResponse('**/_actions/shareRoute/');
    }

    async expectChatComponentVisible() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.locator(this.selectors.chatComponent)).toBeVisible();
    }

    async expectAssistantResponse(expectedMessage: string, timeout = 10000) {
        await expect(this.page.locator(this.selectors.chatMessagesArea)).toContainText(expectedMessage, { timeout });
    }

    async expectAssistantResponseToBeVisible() {
        await this.page.waitForResponse('**/_actions/fillInAssistantData/');
    }

    async expectPlannerContentVisible() {
        await expect(this.page.locator(this.selectors.plannerContent)).toBeVisible();
    }

    async expectMapVisible() {
        await expect(this.page.locator(this.selectors.plannerMapComponent)).toBeVisible();
        await expect(this.page.locator(this.selectors.plannerMapContainer)).toBeVisible();
        await expect(this.page.locator(this.selectors.plannerMapElement)).toBeVisible();
    }

    async expectShareButtonVisible() {
        await expect(this.page.locator(this.selectors.shareRouteButton)).toBeVisible();
    }

    async expectChatError() {
        await expect(this.page.locator(this.selectors.chatError)).toBeVisible();
    }

    async expectShareModalVisible() {
        await expect(this.page.locator(this.selectors.shareTitleInput)).toBeVisible();
        await expect(this.page.locator(this.selectors.shareDescriptionInput)).toBeVisible();
    }

    async expectShareError() {
        await expect(this.page.locator(this.selectors.shareErrorMessage)).toBeVisible();
    }

    async expectAITypingIndicator() {
        await expect(this.page.locator(this.selectors.aiTypingIndicator)).toBeVisible();
    }
}
