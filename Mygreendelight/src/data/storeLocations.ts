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
    id: "arera",
    name: "Arera Colony Hub",
    address: "Plot No. 12, E-3, Arera Colony, Bhopal - 462016",
    phone: "+91 9981418565",
    hours: "7:00 AM - 10:00 PM",
    lat: 23.2167,
    lng: 77.4333,
  },
  {
    id: "kolar",
    name: "Kolar Road Hub",
    address: "Shop No. 8, Main Kolar Road, Bhopal - 462042",
    phone: "+91 9981418565",
    hours: "7:00 AM - 10:00 PM",
    lat: 23.1833,
    lng: 77.4167,
  },
  {
    id: "bairagarh",
    name: "Bairagarh Hub",
    address: "Near 10 No. Market, Bairagarh, Bhopal - 462030",
    phone: "+91 9981418565",
    hours: "7:00 AM - 10:00 PM",
    lat: 23.275,
    lng: 77.34,
  },
  {
    id: "mpnagar",
    name: "MP Nagar Hub",
    address: "Zone II, MP Nagar, Bhopal - 462011",
    phone: "+91 9981418565",
    hours: "7:00 AM - 10:00 PM",
    lat: 23.2333,
    lng: 77.4333,
  },
];
