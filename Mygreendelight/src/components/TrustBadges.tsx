import { ShieldCheck, Truck, RefreshCcw, Headset } from "lucide-react";

export default function TrustBadges() {
  const features = [
    {
      icon: <Truck size={40} className="text-green-600 mb-3" />,
      title: "Superfast Delivery",
      desc: "Get your order delivered to your doorstep at the earliest."
    },
    {
      icon: <ShieldCheck size={40} className="text-green-600 mb-3" />,
      title: "Best Prices & Offers",
      desc: "Cheaper prices than your local supermarket, great cashback."
    },
    {
      icon: <RefreshCcw size={40} className="text-green-600 mb-3" />,
      title: "Easy Returns",
      desc: "Not satisfied with a product? Return it at the doorstep."
    },
    {
      icon: <Headset size={40} className="text-green-600 mb-3" />,
      title: "24/7 Support",
      desc: "Got a question? Our support team is here to help you."
    }
  ];

  return (
    <div className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition duration-300 cursor-pointer hover:-translate-y-1">
              {f.icon}
              <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
