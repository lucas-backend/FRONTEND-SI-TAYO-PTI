import type { Bus } from '@/api/types'

const BUS_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2s-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>`

/** HTML marker bus: pil berlabel + panah arah yang diputar mengikuti heading. */
export function buildBusMarkerHtml(bus: Bus, color: string, selected: boolean): string {
  return `<div class="bus-marker-inner${selected ? ' is-selected' : ''}" style="--bus-color:${color}">
    <div class="bus-arrow"></div>
    <div class="bus-pill">${BUS_SVG}<span>${bus.label} • ${bus.plate}</span></div>
    <div class="bus-stale" hidden></div>
    <div class="bus-pulse"></div>
  </div>`
}

/** HTML marker halte: lingkaran + label. */
export function buildStopIconHtml(name: string, isNext: boolean): string {
  return `<div class="stop-wrap${isNext ? ' is-next' : ''}"><span class="stop-dot"></span><span class="stop-label">${displayStopName(name)}</span></div>`
}

/** HTML pin posisi pengguna (biru, dapat diseret pada mode simulasi). */
export function buildUserPinHtml(draggable: boolean): string {
  return `<div class="user-pin${draggable ? ' is-draggable' : ''}">
    <span class="user-pulse"></span>
    <span class="user-dot"></span>
  </div>`
}
import { displayStopName } from '@/lib/displayNames'
