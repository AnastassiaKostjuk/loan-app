import { expect, Locator, Page } from '@playwright/test';

export class LoanPage {
  readonly amount: Locator;
  readonly amountSlider: Locator;
  readonly period: Locator;
  readonly applyNow: Locator;
  readonly paymentValue: Locator;
  readonly defaultPayment = '42.8 €';
  readonly calculatorHeading: Locator;
  readonly calculationError: Locator;

  constructor(private readonly page: Page) {
    this.amount = page.getByTestId('id-small-loan-calculator-field-amount');
    this.amountSlider = page.getByTestId(
      'id-small-loan-calculator-field-amount-slider',
    );
    this.period = page.getByTestId('ib-small-loan-calculator-field-period');
    this.paymentValue = page.getByTestId(
      'ib-small-loan-calculator-field-monthlyPayment',
    );
    this.applyNow = page.getByTestId('id-small-loan-calculator-field-apply');
    this.calculatorHeading = page.getByRole('heading', {
      name: 'Calculate your monthly payment',
    });
    this.calculationError = page.getByText('Oops, something went wrong', {
      exact: true,
    });
  }

  async open() {
    await this.page.goto('/small-loan');
  }

  async expectCalculator() {
    await expect(this.calculatorHeading).toBeVisible();
  }

  async expectCalculationError() {
    await expect(this.calculationError).toBeVisible();
  }

  async setAmount(value: number) {
    await this.amountSlider.fill(String(value));
  }

  async enterAmount(value: number) {
    await this.amount.fill(String(value));
  }

  async openLogin() {
    await this.applyNow.click();
  }
}
