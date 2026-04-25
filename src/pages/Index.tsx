import { useState } from "react";
import Icon from "@/components/ui/icon";
import MapPage from "./MapPage";
import PaymentPage from "./PaymentPage";
import RatingsPage from "./RatingsPage";
import ProfilePage from "./ProfilePage";

type Tab = "map" | "payment" | "ratings" | "profile";

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "map", icon: "Map", label: "Карта" },
  { id: "payment", icon: "CreditCard", label: "Оплата" },
  { id: "ratings", icon: "Star", label: "Водители" },
  { id: "profile", icon: "User", label: "Профиль" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [orderActive, setOrderActive] = useState(false);
  const [notification, setNotification] = useState(false);

  const handleDriverArrived = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 5000);
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* Status bar placeholder */}
      <div className="bg-white px-5 pt-3 pb-1 flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-semibold text-taxi-dark">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[3, 4, 4, 3].map((h, i) => (
              <div key={i} className="w-0.5 bg-taxi-dark rounded-sm" style={{ height: `${h}px` }} />
            ))}
          </div>
          <Icon name="Wifi" size={12} className="text-taxi-dark" />
          <Icon name="Battery" size={14} className="text-taxi-dark" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Driver arrived notification */}
        {notification && (
          <div className="absolute top-3 left-4 right-4 z-50 animate-slide-up">
            <div className="bg-taxi-dark rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-taxi-yellow flex items-center justify-center text-xl flex-shrink-0">
                🚖
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Водитель прибыл!</p>
                <p className="text-taxi-muted text-xs">Михаил ждёт вас у подъезда</p>
              </div>
              <button onClick={() => setNotification(false)} className="text-taxi-muted">
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}

        <div className={`h-full ${activeTab === "map" ? "block" : "hidden"}`}>
          <MapPage onOrderStart={() => setOrderActive(true)} onDriverArrived={handleDriverArrived} />
        </div>
        <div className={`h-full overflow-y-auto ${activeTab === "payment" ? "block" : "hidden"}`}>
          <PaymentPage />
        </div>
        <div className={`h-full overflow-y-auto ${activeTab === "ratings" ? "block" : "hidden"}`}>
          <RatingsPage />
        </div>
        <div className={`h-full overflow-y-auto ${activeTab === "profile" ? "block" : "hidden"}`}>
          <ProfilePage />
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-white border-t border-border px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-around">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 py-1 px-3 relative"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? "bg-taxi-yellow" : "bg-transparent"
                  }`}
                >
                  <Icon
                    name={tab.icon}
                    size={20}
                    className={isActive ? "text-taxi-dark" : "text-taxi-muted"}
                  />
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? "text-taxi-dark" : "text-taxi-muted"
                  }`}
                >
                  {tab.label}
                </span>
                {tab.id === "map" && orderActive && (
                  <div className="absolute top-1 right-2 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;