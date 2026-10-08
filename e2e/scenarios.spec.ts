import { test, expect } from '@playwright/test'

const OUT = 'docs/screenshots'

test.describe('Skenario demo (BRIEF bagian 14 butir 4-6)', () => {
  test('butir 4: Lokasi Saya / posisi simulasi, halte terdekat & bus tercepat', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.getByText(/Bus Beroperasi/)).toBeVisible()

    await page.getByRole('button', { name: 'Lokasi Saya' }).click()
    await expect(page.getByText('Posisi Simulasi', { exact: true })).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Dekat FMIPA' }).click()

    await expect(page.getByText(/Halte terdekat:/).first()).toBeVisible()
    await expect(page.getByText(/Bus tercepat untuk Anda/i).filter({ visible: true })).toBeVisible()
    await expect(page.getByText(/Berangkat sekarang|Tunggu \d+ menit/).filter({ visible: true })).toBeVisible()
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${OUT}/demo-4-lokasi-saya-390x844.png` })
  })

  test('butir 5: START TRACKING & toggle Penuh terlihat di peta publik <= 3 dtk', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/demo')
    await page.locator('#driver-id').fill('DRV-19842')
    await page.locator('#driver-pin').fill('123456')
    await page.getByRole('button', { name: 'Login' }).click()

    await page.getByRole('button', { name: 'Start Tracking' }).click()
    await expect(page.getByText('GPS Aktif')).toBeVisible()

    const aside = page.locator('aside', { hasText: 'Armada Aktif' })
    await expect(aside.getByText('Penuh', { exact: true })).toHaveCount(0)

    await page.getByRole('button', { name: 'Penuh' }).click()
    await expect(aside.getByText('Penuh', { exact: true })).toBeVisible({ timeout: 3000 })
    await page.screenshot({ path: `${OUT}/demo-5-penuh-1280x800.png` })
  })

  test('butir 6: simulasi sinyal putus lalu pemulihan antrean', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/demo')
    await page.locator('#driver-id').fill('DRV-19842')
    await page.locator('#driver-pin').fill('123456')
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('button', { name: 'Start Tracking' }).click()
    await expect(page.getByText('GPS Aktif')).toBeVisible()

    await page.getByRole('button', { name: 'Simulasikan Sinyal Putus' }).click()
    await expect(page.getByText(/Sinyal putus: lokasi masuk antrean lokal \(\d+\)/)).toBeVisible({ timeout: 8000 })
    await expect(page.getByText(/terakhir diperbarui/).first()).toBeVisible({ timeout: 8000 })
    await page.screenshot({ path: `${OUT}/demo-6-sinyal-putus-1280x800.png` })

    await expect(page.getByText(/Mengirim \d+ lokasi tertunda/)).toBeVisible({ timeout: 35_000 })
    await page.screenshot({ path: `${OUT}/demo-6-pemulihan-1280x800.png` })
  })
})
