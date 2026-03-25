import { expect, test } from "@playwright/test";

test("supports continue mode and block transitions", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("O Nome do Vento")).toBeVisible();
  await page.getByRole("button", { name: "Autoplay: ligado" }).click();
  await expect(
    page.getByRole("button", { name: "Autoplay: desligado" }),
  ).toBeVisible();

  await expect(
    page.getByText("Concluido - pronto para proximo."),
  ).toBeVisible({ timeout: 12000 });

  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Cronista")).toBeVisible();
});
