import { test, expect } from "@playwright/test";
import { PageManager } from "page-objects/pageManager";

test.describe("Login from Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("Login", async ({ page }) => {
    const pageManager = new PageManager(page);
    await pageManager.navigateTo().loginRegisterPage();
    await expect(page.locator("h5").getByText("Anmelden")).toBeVisible();
    const email = page.getByRole("textbox", { name: "E-Mail-Adresse" });
    await email.fill("testUser@test.com");
    const password = page.getByRole("textbox", { name: "Passwort" });
    await password.fill("testtestwest");

    const submitButton = page.getByRole("button", { name: "Anmelden" });
    await submitButton.click();
    await expect(page.locator("h4").getByText("Dashboard")).toBeVisible({ timeout: 10000 });
  });
});
