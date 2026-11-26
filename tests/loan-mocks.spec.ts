import { expect, test } from '@playwright/test';
import { mockCalculationResponse, waitForCalculationResponse } from '../helpers/loan-calculation-mocks';
import { LoanPage } from '../pom/pages/loan-page';

test.describe('Loan calculation API mocks', () => {
  // The error/malformed-response UI is undocumented; these assertions capture current behavior pending clarification.
  test('500 with an empty body shows the observed calculation error', async ({page,}) => {
    const loan = new LoanPage(page);
    await mockCalculationResponse(page, 500, '');
    const responsePromise = waitForCalculationResponse(page);

    await loan.open();

    const response = await responsePromise;
    expect(response.status()).toBe(500);
    await loan.expectCalculator();
    await loan.expectCalculationError();
    await expect(loan.applyNow).toBeEnabled();
  });

  test('200 with an empty body renders the observed undefined payment', async ({page,}) => {
    const loan = new LoanPage(page);
    await mockCalculationResponse(page, 200, '');
    const responsePromise = waitForCalculationResponse(page);

    await loan.open();

    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await loan.expectCalculator();
    await expect(loan.paymentValue).toHaveText('undefined €');
  });

  test('200 with the wrong response key renders the observed undefined payment', async ({page,}) => {
    const loan = new LoanPage(page);
    await mockCalculationResponse(
      page,
      200,
      JSON.stringify({ paymentMonthly: 42.8 }),
    );
    const responsePromise = waitForCalculationResponse(page);

    await loan.open();

    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await loan.expectCalculator();
    await expect(loan.paymentValue).toHaveText('undefined €');
  });
});
