import { test, expect } from '@playwright/test';

// Smoke test for the highest-blast-radius user flow:
//   demo sign-in (auto in test mode) → create trip → activate trip → open
//   Budget page → add expense → verify it lists.
//
// This is exactly the path that broke twice in late-April 2026: the Budget
// page blanked on a fresh trip, and the Itinerary count read 0. The test
// asserts the page actually renders + the mutation persists, not just that
// HTTP 200 came back.

test.describe('TripSync happy path', () => {
  // Suppress the first-visit Quick Tour modal so it doesn't intercept clicks
  // on dashboard buttons. The tour is gated on localStorage; setting the
  // sentinel before navigation skips the auto-open.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('tripsync.quickTour.seen.v1', '1');
    });
  });

  test('demo dashboard loads with sample trips', async ({ page }) => {
    await page.goto('/');
    // sampleData.js seeds three trips; "Japan Adventure" is the first.
    await expect(page.getByRole('heading', { name: 'Japan Adventure' })).toBeVisible({ timeout: 10_000 });
  });

  test('create a trip, open Budget, add an expense', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Japan Adventure' })).toBeVisible({ timeout: 10_000 });

    // ── 1. Open the create-trip modal ──
    // The header has a "New Trip" button (desktop) and a "+ Add" tile in
    // the grid; either is fine — first match wins.
    await page.getByRole('button', { name: /new trip/i }).first().click();

    const tripName = `Smoke ${Date.now()}`;

    // ── 2. Fill the form ──
    // The "Trip Name *" label sits above an unlabeled input; placeholder
    // is the most reliable selector across renders.
    await page.getByPlaceholder(/japan adventure/i).fill(tripName);
    await page.getByPlaceholder(/search destination/i).fill('Mumbai');
    // Currency auto-flips to INR for "Mumbai" via the destination heuristic
    // — no need to interact with the dropdown.

    // ── 3. Submit ──
    await page.getByRole('button', { name: /^create trip$/i }).click();

    // ── 4. New trip auto-activates — both the page header (h1) and the
    // TripDetail card (h2) carry the trip name, so use .first().
    await expect(page.getByRole('heading', { name: tripName }).first()).toBeVisible({ timeout: 5000 });

    // ── 5. Open Budget via TripDetail's tab, NOT page.goto — page.goto
    // would full-reload and reset the in-memory activeTripId. The tab
    // renders the same Budget.jsx component (TripDetail.jsx:16) inside
    // the SPA, which is the realistic user path anyway.
    await page.getByRole('button', { name: /^Budget$/i }).click();

    // Budget page must render without crashing — regression assertion
    // for the "blank Budget after fresh trip" bug.
    await expect(page.getByRole('heading', { name: /budget & expenses/i })).toBeVisible();

    // ── 6. Open Add Expense modal ──
    await page.getByRole('button', { name: /add expense/i }).first().click();

    // ── 7. Fill the form ──
    // The Modal renders Description / Amount labels above plain inputs.
    await page.getByPlaceholder(/dinner at ichiran/i).fill('E2E test dinner');
    await page.getByPlaceholder(/0\.00/).fill('250');

    // ── 8. Submit (button text inside modal is "Add Expense") ──
    // There are now two "Add Expense" buttons on the page (page header +
    // modal footer); .last() targets the modal footer one.
    await page.getByRole('button', { name: /^add expense$/i }).last().click();

    // ── 9. Switch to Expenses tab and verify the entry persisted ──
    await page.getByRole('button', { name: /^expenses$/i }).click();
    await expect(page.getByText('E2E test dinner')).toBeVisible();
    await expect(page.getByText(/250/).first()).toBeVisible();
  });
});
