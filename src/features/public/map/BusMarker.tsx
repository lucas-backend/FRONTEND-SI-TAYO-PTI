import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import * as L from 'leaflet'
import type { Bus, BusPosition, Route } from '@/api/types'
import { SIM } from '@/config'
import { buildBusMarkerHtml } from './icons'

interface BusMarkerProps {
  bus: Bus
  route: Route
  position: BusPosition
  selected: boolean
  onSelect: (busId: string) => void
}

function lerpAngle(from: number, to: number, t: number): number {
  let delta = ((to - from) % 360 + 540) % 360 - 180
  if (delta === -180) delta = 180
  return from + delta * t
}

/**
 * Marker bus dengan animasi mulus lewat requestAnimationFrame: posisi
 * diinterpolasi dari posisi lama ke posisi baru selama ~3 detik tanpa
 * memicu render ulang seluruh peta (marker dimanipulasi via ref Leaflet).
 */
export function BusMarker({ bus, route, position, selected, onSelect }: BusMarkerProps) {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const arrowRef = useRef<HTMLDivElement | null>(null)
  const displayedRef = useRef({ lat: position.lat, lng: position.lng, heading: position.heading })
  const rafRef = useRef<number | null>(null)
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  // Buat marker sekali (dibuat ulang hanya bila belum ada).
  useEffect(() => {
    if (markerRef.current) return
    const template = document.createElement('div')
    template.innerHTML = buildBusMarkerHtml(bus, route.color, false)
    const inner = template.firstElementChild as HTMLDivElement
    innerRef.current = inner
    arrowRef.current = inner.querySelector<HTMLDivElement>('.bus-arrow')
    displayedRef.current = { lat: position.lat, lng: position.lng, heading: position.heading }
    const marker = L.marker([position.lat, position.lng], {
      icon: L.divIcon({ className: 'bus-marker-reset', html: inner, iconSize: [0, 0], iconAnchor: [0, 0] }),
      zIndexOffset: 1000,
      keyboard: false,
    })
    marker.on('click', (event) => {
      L.DomEvent.stopPropagation(event.originalEvent)
      onSelectRef.current(bus.id)
    })
    marker.addTo(map)
    markerRef.current = marker
  }, [map, bus, route.color, position.lat, position.lng, position.heading])

  // Bersihkan saat unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      markerRef.current?.remove()
      markerRef.current = null
    }
  }, [])

  // Animasi interpolasi setiap kali posisi baru datang.
  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return
    const from = displayedRef.current
    const to = { lat: position.lat, lng: position.lng, heading: position.heading }
    const startTime = performance.now()
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / SIM.MARKER_ANIMATION_MS)
      const lat = from.lat + (to.lat - from.lat) * t
      const lng = from.lng + (to.lng - from.lng) * t
      const heading = lerpAngle(from.heading, to.heading, t)
      marker.setLatLng([lat, lng])
      if (arrowRef.current) arrowRef.current.style.transform = `rotate(${heading}deg)`
      displayedRef.current = { lat, lng, heading }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(step)
  }, [position.lat, position.lng, position.heading])

  // Sorotan saat dipilih.
  useEffect(() => {
    innerRef.current?.classList.toggle('is-selected', selected)
  }, [selected])

  return null
}
