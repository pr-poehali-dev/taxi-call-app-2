import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface TaxiCar {
  id: number;
  x: number;
  y: number;
  angle: number;
}

interface MapPageProps {
  onOrderStart: () => void;
}

const MapPage = ({ onOrderStart }: MapPageProps) => {
  const [pickup, setPickup] = useState("Моё местоположение");
  const [destination, setDestination] = useState("");
  const [orderState, setOrderState] = useState<"idle" | "searching" | "found" | "riding">("idle");
  const [taxis, setTaxis] = useState<TaxiCar[]>([
    { id: 1, x: 20, y: 30, angle: 45 },
    { id: 2, x: 65, y: 20, angle: -30 },
    { id: 3, x: 45, y: 55, angle: 120 },
    { id: 4, x: 75, y: 65, angle: -60 },
  ]);
  const [driverPos, setDriverPos] = useState({ x: 20, y: 30 });
  const [eta, setEta] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaxis(prev =>
        prev.map(t => ({
          ...t,
          x: Math.max(5, Math.min(90, t.x + (Math.random() - 0.5) * 3)),
          y: Math.max(5, Math.min(90, t.y + (Math.random() - 0.5) * 3)),
          angle: t.angle + (Math.random() - 0.5) * 10,
        }))
      );
      if (orderState === "found" || orderState === "riding") {
        setDriverPos(prev => ({
          x: Math.max(5, Math.min(90, prev.x + (Math.random() - 0.5) * 2)),
          y: Math.max(5, Math.min(90, prev.y + (Math.random() - 0.5) * 2)),
        }));
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [orderState]);

  useEffect(() => {
    if (orderState === "searching") {
      const t = setTimeout(() => {
        setOrderState("found");
        setEta(4);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [orderState]);

  useEffect(() => {
    if (orderState === "found") {
      const t = setInterval(() => {
        setEta(prev => {
          if (prev <= 1) {
            setOrderState("riding");
            clearInterval(t);
            return 0;
          }
          return prev - 1;
        });
      }, 2000);
      return () => clearInterval(t);
    }
  }, [orderState]);

  const handleOrder = () => {
    if (!destination.trim()) return;
    setOrderState("searching");
    onOrderStart();
  };

  const handleCancel = () => {
    setOrderState("idle");
    setDestination("");
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Map Area */}
      <div className="flex-1 relative bg-[#f0ede8] map-grid overflow-hidden">
        {/* Road lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#ddd6cc" strokeWidth="28" />
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#ece8e1" strokeWidth="26" strokeDasharray="40 20" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#ddd6cc" strokeWidth="28" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#ece8e1" strokeWidth="26" strokeDasharray="40 20" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#ddd6cc" strokeWidth="18" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#ddd6cc" strokeWidth="18" />
          {/* Blocks */}
          <rect x="32%" y="5%" width="36%" height="33%" rx="4" fill="#e8e4dc" />
          <rect x="32%" y="42%" width="36%" height="26%" rx="4" fill="#e8e4dc" />
          <rect x="5%" y="5%" width="23%" height="33%" rx="4" fill="#e8e4dc" />
          <rect x="72%" y="5%" width="23%" height="33%" rx="4" fill="#e8e4dc" />
          <rect x="5%" y="42%" width="23%" height="26%" rx="4" fill="#e8e4dc" />
          <rect x="72%" y="42%" width="23%" height="26%" rx="4" fill="#e8e4dc" />
        </svg>

        {/* Taxis */}
        {taxis.map(taxi => (
          <div
            key={taxi.id}
            className="absolute transition-all duration-1000 ease-linear"
            style={{ left: `${taxi.x}%`, top: `${taxi.y}%`, transform: `translate(-50%, -50%) rotate(${taxi.angle}deg)` }}
          >
            <div className="bg-taxi-yellow rounded-full w-8 h-8 flex items-center justify-center shadow-md text-xs">
              🚕
            </div>
          </div>
        ))}

        {/* Passenger location */}
        <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <div className="relative">
            <div className="absolute inset-0 animate-ripple rounded-full bg-blue-400 opacity-30 w-8 h-8" />
            <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10 relative" />
          </div>
        </div>

        {/* Driver location (when order active) */}
        {(orderState === "found" || orderState === "riding") && (
          <div
            className="absolute transition-all duration-1000 ease-linear z-20"
            style={{ left: `${driverPos.x}%`, top: `${driverPos.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="bg-taxi-dark text-taxi-yellow rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-base animate-scale-in">
              🚖
            </div>
          </div>
        )}

        {/* Route line */}
        {(orderState === "found" || orderState === "riding") && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={`${driverPos.x}%`} y1={`${driverPos.y}%`}
              x2="50%" y2="50%"
              stroke="#FFD600" strokeWidth="3" strokeDasharray="8 4"
            />
          </svg>
        )}

        {/* Top search bar */}
        <div className="absolute top-4 left-4 right-4 z-30">
          <div className="bg-white rounded-2xl shadow-lg p-3 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              <input
                className="flex-1 text-sm text-taxi-dark outline-none placeholder:text-taxi-muted"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                placeholder="Откуда"
              />
            </div>
            <div className="border-t border-border mx-1 mb-2" />
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-taxi-yellow rounded-sm flex-shrink-0" />
              <input
                className="flex-1 text-sm text-taxi-dark outline-none placeholder:text-taxi-muted"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="Куда едем?"
                disabled={orderState !== "idle"}
              />
            </div>
          </div>
        </div>

        {/* Map controls */}
        <div className="absolute right-4 bottom-40 flex flex-col gap-2 z-10">
          <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center">
            <Icon name="Plus" size={18} />
          </button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center">
            <Icon name="Minus" size={18} />
          </button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center">
            <Icon name="Crosshair" size={18} />
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="bottom-sheet bg-white px-5 pt-5 pb-6 z-20">
        {orderState === "idle" && (
          <div className="animate-slide-up">
            <div className="flex gap-3 mb-4 overflow-x-auto pb-1 no-scrollbar">
              {["Эконом", "Комфорт", "Бизнес"].map((cls, i) => (
                <button
                  key={cls}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    i === 1
                      ? "bg-taxi-yellow text-taxi-dark"
                      : "bg-taxi-gray text-taxi-muted"
                  }`}
                >
                  {cls}
                  <span className="ml-1 text-xs">{["149₽", "249₽", "499₽"][i]}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleOrder}
              disabled={!destination.trim()}
              className="w-full py-4 rounded-2xl bg-taxi-dark text-white font-semibold text-base transition-opacity disabled:opacity-40"
            >
              Заказать такси
            </button>
          </div>
        )}

        {orderState === "searching" && (
          <div className="animate-fade-in text-center py-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="animate-pulse-dot w-2 h-2 bg-taxi-yellow rounded-full" />
              <div className="animate-pulse-dot stagger-1 w-2 h-2 bg-taxi-yellow rounded-full" />
              <div className="animate-pulse-dot stagger-2 w-2 h-2 bg-taxi-yellow rounded-full" />
            </div>
            <p className="text-taxi-dark font-semibold text-base">Ищем водителя...</p>
            <p className="text-taxi-muted text-sm mt-1">Обычно не более 2 минут</p>
            <button onClick={handleCancel} className="mt-3 text-sm text-taxi-muted underline">
              Отменить
            </button>
          </div>
        )}

        {orderState === "found" && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-taxi-gray flex items-center justify-center text-xl">
                👨
              </div>
              <div className="flex-1">
                <p className="font-semibold text-taxi-dark">Михаил Петров</p>
                <div className="flex items-center gap-1">
                  <span className="text-taxi-yellow text-sm">★</span>
                  <span className="text-sm text-taxi-muted">4.9 · Toyota Camry · А 123 МК</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-taxi-dark">{eta}</p>
                <p className="text-xs text-taxi-muted">мин</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-2xl bg-taxi-yellow text-taxi-dark font-semibold">
                <Icon name="Phone" size={16} className="inline mr-2" />
                Позвонить
              </button>
              <button onClick={handleCancel} className="flex-1 py-3 rounded-2xl bg-taxi-gray text-taxi-muted font-semibold">
                Отменить
              </button>
            </div>
          </div>
        )}

        {orderState === "riding" && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-taxi-yellow flex items-center justify-center">
                <Icon name="Navigation" size={18} />
              </div>
              <div>
                <p className="font-semibold text-taxi-dark">В пути</p>
                <p className="text-sm text-taxi-muted">Вы едете к цели</p>
              </div>
              <div className="ml-auto bg-taxi-gray px-3 py-1 rounded-xl">
                <p className="text-sm font-medium">249 ₽</p>
              </div>
            </div>
            <div className="w-full bg-taxi-gray rounded-full h-2">
              <div className="bg-taxi-yellow h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
