import { expect, Locator, Page } from '@playwright/test';

export class LoanDetailsPage {
  readonly fullName: Locator;
  readonly continueButton: Locator;
  readonly successOkButton: Locator;

  constructor(private readonly page: Page) {
    this.fullName = page.getByTestId('final-page-full-name');
    this.continueButton = page.getByTestId('final-page-continue-button');
    this.successOkButton = page.getByTestId('final-page-success-ok-button');
  }

  async expectVisible() {
    await expect(this.page).toHaveURL(/loan-decision/i);
    await expect(
      this.page.getByRole('heading', { name: /loan details/i }),
    ).toBeVisible();
    await expect(this.fullName).toBeVisible();
  }

  async continue() {
    await this.continueButton.click();
  }

  async expectSuccessPopup() {
    await expect(
      this.page.getByText('Success!', { exact: true }),
    ).toBeVisible();
    await expect(this.successOkButton).toBeVisible();
  }
}
