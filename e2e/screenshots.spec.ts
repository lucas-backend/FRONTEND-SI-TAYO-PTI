import { test, expect } from '@playwright/test'

const OUT = 'docs/screenshots'
const MOBILE = { width: 390, height: 844 }
const DESKTOP = { width: 1280, height: 800 }

test.describe('Pratinjau mobile 390x844', () => {
  test.use({ viewport: MOBILE })

  test('peta publik', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('BUS UNILA')).toBeVisible()
    await expect(page.getByText(/Bus Beroperasi/)).toBeVisible()
    await page.waitForTimeout(4000)
    await page.screenshot({ path: `${OUT}/public-peta-390x844.png` })
  })

  test('detail bus', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2500)
    await page.locator('.bus-pill').first().click({ force: true })
    await expect(page.getByText(/Sisa \d+ Kursi dari 28 Kapasitas/).filter({ visible: true })).toBeVisible()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${OUT}/public-detail-bus-390x844.png` })
  })

  test('driver login, standby, tracking', async ({ page }) => {
    await page.goto('/driver')
    await expect(page.getByRole('heading', { name: 'Driver Login' })).toBeVisible()
    await page.screenshot({ path: `${OUT}/driver-1-login-390x844.png` })

    await page.locator('#driver-id').fill('DRV-19842')
    await page.locator('#driver-pin').fill('123456')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText('Panel Pengemudi')).toBeVisible()
    await expect(page.getByText('Bpk. Bambang S.')).toBeVisible()
    await page.screenshot({ path: `${OUT}/driver-2-standby-390x844.png` })

    await page.getByRole('button', { name: 'Start Tracking' }).click()
    await expect(page.getByText('GPS Aktif')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Stop Tracking' })).toBeVisible()
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${OUT}/driver-3-tracking-390x844.png` })
  })
})

test.describe('Pratinjau desktop 1280x800', () => {
  test.use({ viewport: DESKTOP })

  test('peta publik desktop', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('BUS UNILA')).toBeVisible()
    await page.waitForTimeout(4000)
    await page.screenshot({ path: `${OUT}/public-peta-1280x800.png` })
  })

  test('mode demo (ponsel + peta satu tab)', async ({ page }) => {
    await page.goto('/demo')
    await expect(page.getByRole('heading', { name: 'Driver Login' })).toBeVisible()
    await page.waitForTimeout(3500)
    await page.screenshot({ path: `${OUT}/demo-driver-login-1280x800.png` })

    await page.locator('#driver-id').fill('DRV-19842')
    await page.locator('#driver-pin').fill('123456')
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('button', { name: 'Start Tracking' }).click()
    await expect(page.getByText('GPS Aktif')).toBeVisible()
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT}/demo-tracking-1280x800.png` })
  })
})
