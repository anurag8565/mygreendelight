"use client";

import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { BHOPAL_HUBS, StoreLocation } from "@/data/storeLocations";

export default function BhopalStoreMap({
  selectedHub,
}: {
  selectedHub?: StoreLocation | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [icon, setIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    setMounted(true);
    const customIcon = new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/128/3177/3177361.png",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -36],
    });
    setIcon(customIcon);
  }, []);

  if (!mounted || !icon) {
    return (
      <div className="w-full h-full min-h-[380px] bg-green-50/70 rounded-2xl flex items-center justify-center text-gray-400 font-medium">
        Loading Bhopal Map...
      </div>
    );
  }

  const centerLat = selectedHub ? selectedHub.lat : 23.2333;
  const centerLng = selectedHub ? selectedHub.lng : 77.4167;

  return (
    <div className="w-full h-full min-h-[380px] rounded-2xl overflow-hidden shadow-inner border border-gray-200 z-10">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={selectedHub ? 14 : 12}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[380px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {BHOPAL_HUBS.map((hub) => (
          <Marker
            key={hub.id}
            position={[hub.lat, hub.lng]}
            icon={icon}
          >
            <Popup className="rounded-xl shadow-lg">
              <div className="p-1 max-w-[200px]">
                <h4 className="font-bold text-gray-900 text-sm">{hub.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{hub.address}</p>
                <p className="text-xs text-green-700 font-semibold mt-1">🕒 {hub.hours}</p>
                <p className="text-xs text-gray-500 mt-0.5">📞 {hub.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
