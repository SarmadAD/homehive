import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async blogPage() {
    await this.page.getByTestId("blog-nav-item").getByText("Blog").click();
  }

  async pricePage() {
    await this.page.getByTestId("price-nav-item").getByText("Preise").click();
  }

  async loginRegisterPage() {
    await this.page.getByText("Jetzt ausprobieren").first().click();
  }
}
