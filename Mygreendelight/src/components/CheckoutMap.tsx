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
          setposition([lat, lng]);
        },
      }}
    />
  );
};

export default function CheckoutMap({
  position,
  setposition,
}: Props) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DraggableMarker
        position={position}
        setposition={setposition}
      />
    </MapContainer>
  );
}