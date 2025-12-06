import test from "@playwright/test";
import { PageManager } from "page-objects/pageManager";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("show the correct Hero text", async ({ page }) => {
    const heroText = page.getByText("Verwalte deine Immobilien mühelos und effizient");
    await test.expect(heroText).toBeVisible();
  });

  test("scroll to end", async ({ page }) => {
    await page.mouse.wheel(0, 10000);
    const footerText = await page.getByText("© 2025 HomeHive");
    await test.expect(footerText).toBeVisible();
  });

  test("navigate to Blog page", async ({ page }) => {
    const pageManager = new PageManager(page);
    await pageManager.navigateTo().blogPage();
    const newArticleHeader = page.getByText("Neueste Artikel");
    await test.expect(newArticleHeader).toBeVisible();
  });

  test("navigate to Pricing page", async ({ page }) => {
    const pageManager = new PageManager(page);
    await pageManager.navigateTo().pricePage();
    const pricingHeader = page.getByText("Verwalte deine Immobilien mühelos mit unserer Lösung");
    await test.expect(pricingHeader).toBeVisible();
  });
});
