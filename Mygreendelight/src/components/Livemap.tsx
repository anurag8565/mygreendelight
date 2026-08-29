'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'

import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'

interface Props {
  customerLocation: {
    latitude: number
    longitude: number
  }
  deliveryLocation?: {
    latitude: number
    longitude: number
  }
  isDeliveryBoy?: boolean
}

const isValidCoord = (loc: any) =>
  loc &&
  typeof loc.latitude === 'number' &&
  typeof loc.longitude === 'number' &&
  !isNaN(loc.latitude) &&
  !isNaN(loc.longitude) &&
  loc.latitude !== 0 &&
  loc.longitude !== 0 &&
  Math.abs(loc.latitude) <= 90 &&
  Math.abs(loc.longitude) <= 180

function Routing({
  start,
  end,
}: {
  start: [number, number]
  end: [number, number]
}) {
  const map = useMap()

  useEffect(() => {
    if (!start || !end || !start[0] || !start[1] || !end[0] || !end[1]) return
    if (start[0] === 0 || start[1] === 0 || end[0] === 0 || end[1] === 0) return

    let routingControl: any = null
    try {
      routingControl = (L as any).Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1]),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false,
        createMarker: () => null, // Let custom markers render instead
      })

      // Silently catch routing error (e.g. OSRM unreachable or test coordinates)
      routingControl.on('routingerror', (err: any) => {
        // Suppress popup
      })

      routingControl.addTo(map)
    } catch (e) {
      // Ignored
    }

    return () => {
      if (routingControl && map) {
        try {
          map.removeControl(routingControl)
        } catch (e) {}
      }
    }
  }, [map, start, end])

  return null
}

export default function Livemap({
  customerLocation,
  deliveryLocation,
  isDeliveryBoy = false,
}: Props) {
  const [myLocation, setMyLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  useEffect(() => {
    if (!isDeliveryBoy) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setMyLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      (err) => {
        console.warn("Geolocation watch warning:", err)
      },
      {
        enableHighAccuracy: true,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [isDeliveryBoy])

  useEffect(() => {
    if (!isDeliveryBoy || !myLocation) return

    const interval = setInterval(async () => {
      try {
        await axios.post('/api/delivery/updatelocation', {
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
        })
      } catch (error) {
        console.warn("Location update failed:", error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [myLocation, isDeliveryBoy])

  const currentLocation = isDeliveryBoy ? myLocation : deliveryLocation

  const customerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [40, 40],
  })

  const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/2972/2972185.png',
    iconSize: [40, 40],
  })

  const hasValidCustomer = isValidCoord(customerLocation)
  const hasValidCurrent = isValidCoord(currentLocation)

  const center: LatLngExpression = hasValidCustomer
    ? [customerLocation.latitude, customerLocation.longitude]
    : [23.2599, 77.4126] // Default Bhopal coordinates

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  let distance = 0
  let minutes = 0

  if (hasValidCurrent && hasValidCustomer) {
    distance = calculateDistance(
      currentLocation!.latitude,
      currentLocation!.longitude,
      customerLocation.latitude,
      customerLocation.longitude
    )
    const speed = 30
    const eta = distance / speed
    minutes = Math.max(5, Math.round(eta * 60))
  }

  return (
    <div>
      {hasValidCurrent && (
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl text-xs font-black shadow-2xs flex items-center gap-1.5">
            📍 {distance > 0 ? `${distance.toFixed(2)} KM Away` : "Nearby"}
          </div>

          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl text-xs font-black shadow-2xs flex items-center gap-1.5">
            ⏱ ETA: ~{minutes || 15} Mins
          </div>

          {hasValidCustomer && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.google.com/maps/dir/?api=1&destination=${customerLocation.latitude},${customerLocation.longitude}`}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black shadow-2xs transition"
            >
              Open in Google Maps
            </a>
          )}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xs">
        <MapContainer center={center} zoom={14} className="w-full h-[450px]">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {hasValidCustomer && (
            <Marker
              position={[customerLocation.latitude, customerLocation.longitude]}
              icon={customerIcon}
            >
              <Popup>Delivery Destination (Customer)</Popup>
            </Marker>
          )}

          {hasValidCurrent && hasValidCustomer && (
            <>
              <Routing
                start={[currentLocation!.latitude, currentLocation!.longitude]}
                end={[customerLocation.latitude, customerLocation.longitude]}
              />

              <Marker
                position={[currentLocation!.latitude, currentLocation!.longitude]}
                icon={truckIcon}
              >
                <Popup>Delivery Rider</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  )
}