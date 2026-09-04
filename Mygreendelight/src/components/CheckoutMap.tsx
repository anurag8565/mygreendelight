"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

type Props = {
  position: [number, number];
  setposition: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
};

// Strict Bhopal Bounding Box
const BHOPAL_BOUNDS: [[number, number], [number, number]] = [
  [23.05, 77.20], // Southwest coordinate
  [23.40, 77.60], // Northeast coordinate
];

const clampToBhopal = (lat: number, lng: number): [number, number] => {
  const clampedLat = Math.min(23.38, Math.max(23.08, lat));
  const clampedLng = Math.min(77.58, Math.max(77.25, lng));
  return [clampedLat, clampedLng];
};

const DraggableMarker = ({
  position,
  setposition,
}: Props) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position as LatLngExpression, 15);
  }, [map, position]);

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable
      eventHandlers={{
        dragend(e) {
          const marker = e.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          const [clampedLat, clampedLng] = clampToBhopal(lat, lng);
          setposition([clampedLat, clampedLng]);
        },
      }}
    />
  );
};

export default function CheckoutMap({
  position,
  setposition,
}: Props) {
  const safePosition = clampToBhopal(position[0], position[1]);

  return (
    <MapContainer
      center={safePosition}
      zoom={14}
      minZoom={11}
      maxZoom={18}
      maxBounds={BHOPAL_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DraggableMarker
        position={safePosition}
        setposition={setposition}
      />
    </MapContainer>
  );
}