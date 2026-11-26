import { Page, Response } from '@playwright/test';

const calculationEndpoint = 'https://backend.tallinn-learning.ee/api/loan-calc';

export async function mockCalculationResponse(
  page: Page,
  status: number,
  body: string,
): Promise<void> {
  await page.route(`${calculationEndpoint}**`, (route) =>
    route.request().method() === 'GET'
      ? route.fulfill({
          status,
          body,
          headers: { 'content-type': 'application/json' },
        })
      : route.continue(),
  );
}

export function waitForCalculationResponse(page: Page): Promise<Response> {
  return page.waitForResponse((response) => {
    const requestUrl = new URL(response.url());
    return (
      requestUrl.origin === 'https://backend.tallinn-learning.ee' &&
      requestUrl.pathname === '/api/loan-calc' &&
      response.request().method() === 'GET'
    );
  });
}
