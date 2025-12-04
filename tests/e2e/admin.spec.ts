import { test, expect } from '@playwright/test';

test.describe('Admin Portal', () => {
    test('should allow admin login', async ({ page }) => {
        await page.goto('/admin/login');

        await page.getByPlaceholder('admin@datesl.lk').fill('admin@datesl.lk');
        await page.getByPlaceholder('••••••••').fill('admin123');
        await page.getByRole('button', { name: 'Access Dashboard' }).click();

        await expect(page).toHaveURL('/admin/dashboard');
        await expect(page.getByRole('heading', { name: 'DateSL Admin' })).toBeVisible();
    });

    test('should show error on invalid credentials', async ({ page }) => {
        await page.goto('/admin/login');

        await page.getByPlaceholder('admin@datesl.lk').fill('wrong@example.com');
        await page.getByPlaceholder('••••••••').fill('wrongpass');

        // Handle alert
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Invalid credentials');
            await dialog.dismiss();
        });

        await page.getByRole('button', { name: 'Access Dashboard' }).click();
        await expect(page).toHaveURL('/admin/login');
    });
});
