import { test as base, Page } from '@playwright/test';
import { AuthPage } from '../page-objects/pages/auth.page';
import playwrightConfig from '../../playwright.config';
import path from 'path';
import fs from 'fs';

// Declare worker-specific fixtures
export type WorkerFixtures = {
    workerStorageState: string;
};

// Declare test-specific fixtures
export type TestFixtures = {
    authenticatedPage: Page;
};

// Create the fixtures
export const test = base.extend<TestFixtures, WorkerFixtures>({
    // Use the same storage state for all tests in this worker.
    storageState: ({ workerStorageState }, use) => use(workerStorageState),
    // Define worker fixture
    workerStorageState: [
        async ({ browser }, use) => {
            const fileName = path.resolve(__dirname, `../.auth/user.json`);

            if (fs.existsSync(fileName)) {
                await use(fileName);
                return;
            }

            const context = await browser.newContext({
                baseURL: playwrightConfig.use?.baseURL,
            });
            const page = await context.newPage();

            const authPage = new AuthPage(page);
            await authPage.goto();
            await authPage.signIn(process.env.TEST_USER_EMAIL || '', process.env.TEST_USER_PASSWORD || '');
            await authPage.expectSuccessfulAuth();

            const storageStateFile = './e2e/.auth/user.json';
            await page.context().storageState({ path: storageStateFile });

            await use(storageStateFile);

            await context.close();
        },
        { scope: 'worker' },
    ],
});
