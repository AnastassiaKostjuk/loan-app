import { test, expect } from '@playwright/test';
import { LoanPage } from '../pom/pages/loan-page';
import { LoginPage } from '../pom/pages/login-page';
import { LoanDetailsPage } from '../pom/pages/loan-details-page';

test.describe('Loan application', () => {
  test('[TL-HW20-1] calculator shows observed defaults', async ({ page }) => {
    const loan = new LoanPage(page);
    await loan.open();
    await loan.expectCalculator();
    await expect(loan.amount).toHaveValue('500');
    await expect(loan.period).toHaveValue('12');
    await expect(loan.paymentValue).toHaveText(loan.defaultPayment);
  });

  test('[TL-HW20-2] changing slider amount recalculates payment', async ({page,}) => {
    const loan = new LoanPage(page);
    await loan.open();
    const previousPayment = await loan.paymentValue.innerText();
    const response = page.waitForResponse(
      (r) =>
        r.url().includes('/api/loan-calc') &&
        r.url().includes('amount=1000') &&
        r.status() === 200,
    );
    await loan.setAmount(1000);
    await response;
    await expect(loan.amount).toHaveValue('1000');
    await expect(loan.paymentValue).not.toHaveText(previousPayment);
  });

  test('[TL-HW20-3] entering an amount recalculates the monthly payment', async ({page,}) => {
    const loan = new LoanPage(page);
    await loan.open();
    const previousPayment = await loan.paymentValue.innerText();
    const response = page.waitForResponse(
      (r) =>
        r.url().includes('/api/loan-calc') &&
        r.url().includes('amount=1200') &&
        r.status() === 200,
    );
    await loan.enterAmount(1200);
    await response;
    await expect(loan.amount).toHaveValue('1200');
    await expect(loan.paymentValue).not.toHaveText(previousPayment);
  });

  test('[TL-HW20-4] Apply Now opens the login form', async ({ page }) => {
    const loan = new LoanPage(page);
    const login = new LoginPage(page);
    await loan.open();
    await loan.openLogin();
    await login.expectVisible();
  });

  test('[TL-HW20-5] loan application shows the full name on Loan Details', async ({page,}) => {
    const loan = new LoanPage(page);
    const login = new LoginPage(page);
    await loan.open();
    await loan.openLogin();
    await login.login(process.env.LOAN_USERNAME!, process.env.LOAN_PASSWORD!);
    const details = new LoanDetailsPage(page);
    await details.expectVisible();
    await expect(details.fullName).toHaveValue('Name Surname');
    await expect(details.fullName).toBeDisabled();
  });

  test('[TL-HW20-6] mobile scroll brings Apply Now into the viewport', async ({page,}) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const loan = new LoanPage(page);
    await loan.open();
    await loan.expectCalculator();
    await loan.applyNow.scrollIntoViewIfNeeded();
    await expect(loan.applyNow).toBeInViewport();
  });

  test('[TL-HW20-7] Continue shows the Success popup on Loan Details', async ({page,}) => {
    const loan = new LoanPage(page);
    const login = new LoginPage(page);
    const details = new LoanDetailsPage(page);

    await loan.open();
    await loan.openLogin();
    await login.login(process.env.LOAN_USERNAME!, process.env.LOAN_PASSWORD!);
    await details.expectVisible();
    await details.continue();
    await details.expectSuccessPopup();
  });
});
