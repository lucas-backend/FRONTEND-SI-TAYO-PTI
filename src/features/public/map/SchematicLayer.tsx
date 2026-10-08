import { Marker, Rectangle } from 'react-leaflet'
import * as L from 'leaflet'

interface SchematicBlock {
  name: string
  lat: number
  lng: number
  w: number
  h: number
}

// Blok bangunan skematik memakai koordinat gedung nyata (lihat mock/data/stops.ts).
const BLOCKS: SchematicBlock[] = [
  { name: 'FISIP', lat: -5.363, lng: 105.245, w: 0.0011, h: 0.0008 },
  { name: 'Perpus Pusat', lat: -5.3617, lng: 105.2405, w: 0.0014, h: 0.0009 },
  { name: 'Rektorat', lat: -5.36435, lng: 105.24316, w: 0.0013, h: 0.0008 },
  { name: 'FK Unila', lat: -5.3683, lng: 105.2475, w: 0.0016, h: 0.001 },
  { name: 'FT Unila', lat: -5.3622, lng: 105.2424, w: 0.0014, h: 0.0009 },
  { name: 'FMIPA', lat: -5.3671, lng: 105.2442, w: 0.0013, h: 0.0008 },
  { name: 'Embung U Ika', lat: -5.3653, lng: 105.2389, w: 0.0012, h: 0.0009 },
  { name: 'Bundaran Unila', lat: -5.3704, lng: 105.2423, w: 0.0012, h: 0.0008 },
]

/** Latar skematik sederhana (opsional): blok bangunan berlabel. */
export function SchematicLayer() {
  return (
    <>
      {BLOCKS.map((block) => (
        <Rectangle
          key={block.name}
          bounds={[
            [block.lat - block.h, block.lng - block.w],
            [block.lat + block.h, block.lng + block.w],
          ]}
          pathOptions={{ fillColor: '#d8dded', fillOpacity: 0.92, stroke: false }}
        />
      ))}
      {BLOCKS.map((block) => (
        <Marker
          key={`label-${block.name}`}
          position={[block.lat, block.lng]}
          interactive={false}
          icon={L.divIcon({
            className: 'schematic-label-icon',
            html: `<span class="schematic-label">${block.name}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })}
        />
      ))}
    </>
  )
}
