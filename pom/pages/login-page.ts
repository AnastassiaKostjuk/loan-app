import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  constructor(private readonly page: Page) {
    this.username = page.getByTestId('login-popup-username-input');
    this.password = page.getByTestId('login-popup-password-input');
    this.submit = page.getByTestId('login-popup-continue-button');
  }
  async expectVisible() {
    await expect(
      this.page.getByRole('heading', { name: 'Login' }),
    ).toBeVisible();
    await expect(this.username).toBeVisible();
    await expect(this.password).toBeVisible();
    await expect(this.submit).toBeVisible();
  }
  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}
