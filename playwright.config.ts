import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Load environment variables from .env.e2e
 */
dotenv.config({ path: '.env.e2e' });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './e2e/specs',
    testMatch: '**/*.spec.ts',
    timeout: 30 * 1000,
    workers: 1,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:4321', // Astro's default port
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    webServer: {
        command: 'npm run dev',
        port: 4321,
        reuseExistingServer: !process.env.CI,
        env: {
            FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID!,
            FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY!,
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
            FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL!,
            FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID!,
            FIREBASE_AUTH_URI: process.env.FIREBASE_AUTH_URI!,
            FIREBASE_TOKEN_URI: process.env.FIREBASE_TOKEN_URI!,
            FIREBASE_AUTH_CERT_URL: process.env.FIREBASE_AUTH_CERT_URL!,
            FIREBASE_CLIENT_CERT_URL: process.env.FIREBASE_CLIENT_CERT_URL!,
            PUBLIC_FIREBASE_API_KEY: process.env.PUBLIC_FIREBASE_API_KEY!,
            PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN!,
            PUBLIC_FIREBASE_PROJECT_ID: process.env.PUBLIC_FIREBASE_PROJECT_ID!,
            PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET!,
            PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
            PUBLIC_FIREBASE_APP_ID: process.env.PUBLIC_FIREBASE_APP_ID!,
            PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID || '',
            GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY || '',
            GOOGLE_GENAI_MODEL: process.env.GOOGLE_GENAI_MODEL,
        },
    },
});
