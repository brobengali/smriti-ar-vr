import { useEffect, useState } from 'react'
import type { Monument } from '../data/types'

export interface LatLng {
  lat: number
  lng: number
}

/** Great-circle distance in km. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const la1 = (a.lat * Math.PI) / 180
  const la2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function sortByDistance(monuments: Monument[], here: LatLng): Array<{ monument: Monument; km: number }> {
  return monuments
    .map((monument) => ({ monument, km: haversineKm(here, { lat: monument.lat, lng: monument.lng }) }))
    .sort((a, b) => a.km - b.km)
}

export type GeoState = { status: 'idle' | 'locating' | 'ok' | 'denied'; pos?: LatLng }

export function useGeolocation(enabled = true): GeoState {
  const [state, setState] = useState<GeoState>({ status: enabled ? 'locating' : 'idle' })
  useEffect(() => {
    if (!enabled) return
    if (!('geolocation' in navigator)) {
      setState({ status: 'denied' })
      return
    }
    let cancelled = false
    navigator.geolocation.getCurrentPosition(
      (p) => !cancelled && setState({ status: 'ok', pos: { lat: p.coords.latitude, lng: p.coords.longitude } }),
      () => !cancelled && setState({ status: 'denied' }),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    )
    return () => {
      cancelled = true
    }
  }, [enabled])
  return state
}

export function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 100) return km.toFixed(1)
  return Math.round(km).toLocaleString('en-IN')
}
