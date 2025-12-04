import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
    test('should allow sending a message in chat', async ({ page }) => {
        // Navigate to a profile
        await page.goto('/profile/1');

        // Open chat
        await page.getByRole('button', { name: 'Send Message' }).click();

        // Check if chat window opens
        await expect(page.getByText('Online')).toBeVisible();

        // Type and send message
        await page.getByPlaceholder('Ask about family, hobbies, etc...').fill('Hello there!');
        await page.waitForTimeout(500);
        const sendButton = page.locator('button[aria-label="Send message"]');
        await expect(sendButton).toBeEnabled();
        await sendButton.click();

        // Check if message appears
        await expect(page.getByText('Hello there!')).toBeVisible();

        // Wait for AI response (simulated)
        await expect(page.getByText('Dilani')).toBeVisible(); // Name in header
        // We can't easily predict the random AI response text, but we can check if a new message appears
        // For now, just checking user message is enough for this happy path
    });
});
