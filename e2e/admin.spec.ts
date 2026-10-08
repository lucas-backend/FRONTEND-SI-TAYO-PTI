import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const OUT = 'docs/screenshots'
const DESKTOP = { width: 1280, height: 800 }
const TABLET = { width: 768, height: 1024 }

async function loginAdmin(page: Page) {
  await page.goto('/admin/login')
  await page.locator('#admin-username').fill('admin')
  await page.locator('#admin-pin').fill('admin123')
  await page.getByRole('button', { name: 'Masuk' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
}

const PAGES = [
  ['dashboard', '/admin/dashboard'],
  ['monitor', '/admin/monitor'],
  ['armada', '/admin/armada'],
  ['akun', '/admin/akun'],
  ['rute-halte', '/admin/rute-halte'],
] as const

test.describe('Screenshot admin 1280x800', () => {
  test('login dan seluruh halaman admin', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await page.goto('/admin/login')
    await expect(page.getByRole('heading', { name: 'Masuk Admin' })).toBeVisible()
    await page.screenshot({ path: `${OUT}/admin-login-1280x800.png` })

    await loginAdmin(page)
    for (const [name, path] of PAGES) {
      await page.goto(path)
      await page.waitForTimeout(1500)
      await page.screenshot({ path: `${OUT}/admin-${name}-1280x800.png` })
    }
  })
})

test.describe('Screenshot admin 768x1024 (tablet)', () => {
  test('login dan seluruh halaman admin', async ({ page }) => {
    await page.setViewportSize(TABLET)
    await page.goto('/admin/login')
    await expect(page.getByRole('heading', { name: 'Masuk Admin' })).toBeVisible()
    await page.screenshot({ path: `${OUT}/admin-login-768x1024.png` })

    await loginAdmin(page)
    for (const [name, path] of PAGES) {
      await page.goto(path)
      await page.waitForTimeout(1500)
      await page.screenshot({ path: `${OUT}/admin-${name}-768x1024.png` })
    }
  })
})

test.describe('Alur admin', () => {
  test('login -> tambah bus muncul di /demo -> nonaktifkan -> bus hilang', async ({ context, page }) => {
    await page.setViewportSize(DESKTOP)
    const demo = await context.newPage()
    await demo.setViewportSize(DESKTOP)
    await demo.goto('/demo')
    await expect(demo.locator('.bus-pill').first()).toBeVisible({ timeout: 25_000 })

    await loginAdmin(page)
    await page.goto('/admin/armada')
    await page.getByRole('button', { name: 'Tambah Bus' }).click()
    await page.locator('#bus-plate').fill('BE 9999 XX')
    await page.locator('#bus-label').fill('Bus Uji')
    await page.locator('#bus-route').selectOption('J1')
    await page.locator('#bus-driver').selectOption({ index: 1 })
    await page.locator('#bus-capacity').fill('30')
    await page.getByRole('button', { name: 'Simpan Bus' }).click()
    await expect(page.getByText('Armada baru berhasil ditambahkan')).toBeVisible()

    await expect(demo.locator('.bus-pill', { hasText: 'BE 9999 XX' })).toBeVisible({ timeout: 25_000 })
    await demo.screenshot({ path: `${OUT}/admin-flow-bus-baru-1280x800.png` })

    const row = page.getByRole('row', { name: /Bus Uji/ })
    await row.getByRole('switch').click()
    await expect(page.getByText('Bus Uji dinonaktifkan')).toBeVisible()
    await expect(demo.locator('.bus-pill', { hasText: 'BE 9999 XX' })).toHaveCount(0, { timeout: 25_000 })
    await demo.screenshot({ path: `${OUT}/admin-flow-bus-nonaktif-1280x800.png` })
  })
})
