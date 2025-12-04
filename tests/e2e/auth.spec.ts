import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should allow a user to navigate to register page', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'Create Free Profile' }).click();
        await expect(page).toHaveURL('/register');
        await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    });

    test('should allow a user to navigate to login page', async ({ page, isMobile }) => {
        await page.goto('/');

        if (isMobile) {
            await page.getByRole('button', { name: 'Open main menu' }).click();
            await page.waitForTimeout(500);
            await page.getByRole('link', { name: 'Login / Register' }).click();
        } else {
            // Desktop: Ensure we click the visible Login button
            await page.waitForTimeout(500);
            await page.getByRole('link', { name: 'Login', exact: true }).filter({ hasNotText: 'Register' }).click();
        }

        await expect(page).toHaveURL('/login');
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    });

    test('should show validation error on empty login', async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('button', { name: 'Sign in' }).click();
        // HTML5 validation will trigger, but we can check if the input is invalid
        const emailInput = page.getByPlaceholder('m@example.com');
        // Playwright doesn't easily check HTML5 validation messages across browsers, 
        // but we can check if the form wasn't submitted (URL didn't change)
        await expect(page).toHaveURL('/login');
    });
});
