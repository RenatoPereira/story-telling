import { expect, test } from "@playwright/test";

test("supports continue mode and block transitions", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("O Nome do Vento")).toBeVisible();
  const autoplayButton = page.getByRole("button", { name: "Alternar autoplay" });
  await autoplayButton.click();
  await expect(autoplayButton).toHaveAttribute("aria-pressed", "false");

  const continueButton = page.getByRole("button", { name: "Continuar" });
  await expect(continueButton).toBeEnabled({ timeout: 12000 });

  const initialUrl = new URL(page.url());
  const initialBlockId = initialUrl.searchParams.get("blockId");

  await continueButton.click();
  await expect
    .poll(() => {
      const url = new URL(page.url());
      return url.searchParams.get("blockId");
    })
    .not.toBe(initialBlockId);
});
