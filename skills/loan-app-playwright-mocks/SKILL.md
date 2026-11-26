---
name: loan-app-playwright-mocks
description: Add or update Loan App Playwright tests, especially tests that intercept and mock network responses.
---

# Loan App Playwright Tests and Mocks

Use this skill when adding an automated test to the Loan App project, especially when mocking a network response.

## Learn the project first

Inspect `tests/`, `pom/pages/`, shared helpers, `playwright.config.ts`, package scripts, and recent `git log` entries. Follow the existing Page Object Model, naming, test ID, and formatting conventions. Reuse existing Page Objects and helpers where they fit.

## Add a network mock test

1. Find the real request and its contract in project documentation/tests or in the browser Network panel. Confirm URL, HTTP method, response status, content type, and JSON field names. Do not infer an endpoint or successful response shape from a UI label.
2. Register `page.route(...)` before the action that triggers the request. Match the observed endpoint and method narrowly enough to avoid intercepting unrelated traffic.
3. Build the mock with the scenario's status, body, and headers. For malformed-body scenarios, change only the property or body required by the scenario; keep the rest grounded in the observed contract.
4. If the test needs to inspect the network result, create `page.waitForResponse(...)` before triggering the action, then perform the action and await that response.
5. Assert the resulting UI state using Page Object locators. Prefer observed `data-testid` attributes; otherwise use accessible roles, labels, or text confirmed in the DOM. Do not invent selectors, error messages, or desired error behavior.
6. If no documented contract defines the UI for an error or malformed response, record the observed current behavior as a characterization and ask the project owner/teacher what the intended behavior should be. Do not present the observed behavior as a product requirement.

## Validate

Run the new test first, then run the full suite with `npx playwright test`. Run `npm run check` and `npm run lint` when available. Review the diff and confirm every route is registered before the triggering action and every response wait is created before it as well.

## Do not

- Invent URLs, methods, payload keys, test IDs, locators, or expected UI states.
- Use fixed sleeps to wait for network activity or rendering.
- silently turn an undocumented behavior into an acceptance criterion; surface the question in the test comments or final report.
