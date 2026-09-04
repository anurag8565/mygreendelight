export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

export const BHOPAL_HUBS: StoreLocation[] = [
  {
    id: "amrai-bagsewaniya",
    name: "MyGreenDelight Store",
    address: "Amrai, Bagsewaniya, Bhopal, MP - 462043",
    phone: "+91 9981418565",
    hours: "6:00 AM - 1:00 PM",
    lat: 23.1956,
    lng: 77.4645,
  },
];
