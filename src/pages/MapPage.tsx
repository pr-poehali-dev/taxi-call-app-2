import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

interface TaxiCar {
  id: number;
  x: number;
  y: number;
  angle: number;
}

interface MapPageProps {
  onOrderStart: () => void;
  onDriverArrived: () => void;
}

const FAVORITES = [
  { label: "Дом", icon: "Home", address: "ул. Ленина, 12" },
  { label: "Работа", icon: "Briefcase", address: "пр. Мира, 45" },
];

const DRIVER_MESSAGES = [
  "Буду через пару минут",
  "Стою у главного входа",
  "Ищу парковку рядом",
  "Напишите, если не видите машину",
];

interface ChatMessage {
  from: "driver" | "me";
  text: string;
  time: string;
}

const MapPage = ({ onOrderStart, onDriverArrived }: MapPageProps) => {
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
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "driver", text: "Еду к вам, скоро буду!", time: nowTime() },
  ]);
  const [unread, setUnread] = useState(1);
  const chatEndRef = useRef<HTMLDivElement>(null);

  function nowTime() {
    return new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
  }

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
        setMessages([{ from: "driver", text: "Еду к вам, скоро буду!", time: nowTime() }]);
        setUnread(1);
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
            onDriverArrived();
            clearInterval(t);
            // Auto driver message when arrived
            setTimeout(() => {
              setMessages(m => [...m, { from: "driver", text: "Стою у подъезда 🚖", time: nowTime() }]);
              if (!chatOpen) setUnread(u => u + 1);
            }, 500);
            return 0;
          }
          return prev - 1;
        });
      }, 2000);
      return () => clearInterval(t);
    }
  }, [orderState, chatOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  // Periodic driver messages during riding
  useEffect(() => {
    if (orderState === "riding") {
      const t = setTimeout(() => {
        const msg = DRIVER_MESSAGES[Math.floor(Math.random() * DRIVER_MESSAGES.length)];
        setMessages(m => [...m, { from: "driver", text: msg, time: nowTime() }]);
        if (!chatOpen) setUnread(u => u + 1);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [orderState, messages.length]);

  const handleOrder = () => {
    if (!destination.trim()) return;
    setOrderState("searching");
    onOrderStart();
  };

  const handleCancel = () => {
    setOrderState("idle");
    setDestination("");
    setChatOpen(false);
    setMessages([]);
    setUnread(0);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(m => [...m, { from: "me", text: chatInput.trim(), time: nowTime() }]);
    setChatInput("");
    // Driver replies
    setTimeout(() => {
      const replies = ["Понял!", "Хорошо, жду", "Окей 👍", "Сейчас подъеду"];
      setMessages(m => [...m, { from: "driver", text: replies[Math.floor(Math.random() * replies.length)], time: nowTime() }]);
    }, 1500);
  };

  const openChat = () => {
    setChatOpen(true);
    setUnread(0);
  };

  const isOrderActive = orderState === "found" || orderState === "riding";

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat overlay */}
      {chatOpen && (
        <div className="absolute inset-0 z-40 flex flex-col bg-white animate-fade-in">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-white">
            <button onClick={() => setChatOpen(false)} className="w-8 h-8 rounded-xl bg-taxi-gray flex items-center justify-center">
              <Icon name="ChevronLeft" size={18} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-taxi-gray flex items-center justify-center text-xl">👨</div>
            <div>
              <p className="font-semibold text-taxi-dark text-sm">Михаил Петров</p>
              <p className="text-xs text-green-500 font-medium">● В сети</p>
            </div>
            <button className="ml-auto w-10 h-10 rounded-xl bg-taxi-yellow flex items-center justify-center">
              <Icon name="Phone" size={16} className="text-taxi-dark" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-taxi-gray/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  msg.from === "me"
                    ? "bg-taxi-dark text-white rounded-br-sm"
                    : "bg-white text-taxi-dark rounded-bl-sm shadow-sm"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === "me" ? "text-white/50" : "text-taxi-muted"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick replies */}
          <div className="px-4 pt-2 flex gap-2 overflow-x-auto pb-1">
            {["Где вы?", "Жду у входа", "Иду уже"].map(q => (
              <button
                key={q}
                onClick={() => { setChatInput(q); }}
                className="flex-shrink-0 text-xs bg-taxi-gray px-3 py-1.5 rounded-xl text-taxi-dark font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-white">
            <input
              className="flex-1 bg-taxi-gray rounded-xl px-4 py-3 text-sm outline-none text-taxi-dark"
              placeholder="Сообщение водителю..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim()}
              className="w-10 h-10 rounded-xl bg-taxi-dark flex items-center justify-center disabled:opacity-40"
            >
              <Icon name="Send" size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}

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
            <div className="bg-taxi-yellow rounded-full w-8 h-8 flex items-center justify-center shadow-md text-xs">🚕</div>
          </div>
        ))}

        {/* Passenger */}
        <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <div className="relative">
            <div className="absolute inset-0 animate-ripple rounded-full bg-blue-400 opacity-30 w-8 h-8" />
            <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10 relative" />
          </div>
        </div>

        {/* Driver */}
        {isOrderActive && (
          <div
            className="absolute transition-all duration-1000 ease-linear z-20"
            style={{ left: `${driverPos.x}%`, top: `${driverPos.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="bg-taxi-dark text-taxi-yellow rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-base animate-scale-in">🚖</div>
          </div>
        )}

        {/* Route line */}
        {isOrderActive && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1={`${driverPos.x}%`} y1={`${driverPos.y}%`} x2="50%" y2="50%" stroke="#FFD600" strokeWidth="3" strokeDasharray="8 4" />
          </svg>
        )}

        {/* Search bar */}
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
            {/* Favorites */}
            {orderState === "idle" && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                {FAVORITES.map(fav => (
                  <button
                    key={fav.label}
                    onClick={() => setDestination(fav.address)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-taxi-gray rounded-xl flex-1"
                  >
                    <Icon name={fav.icon} size={13} className="text-taxi-muted" />
                    <span className="text-xs font-medium text-taxi-dark">{fav.label}</span>
                  </button>
                ))}
              </div>
            )}
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
            <div className="mb-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-taxi-yellow">
                <span className="text-sm font-semibold text-taxi-dark">Эконом</span>
                <span className="text-sm text-taxi-dark/70">149 ₽</span>
              </div>
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
            <button onClick={handleCancel} className="mt-3 text-sm text-taxi-muted underline">Отменить</button>
          </div>
        )}

        {orderState === "found" && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-taxi-gray flex items-center justify-center text-xl">👨</div>
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
              <button onClick={openChat} className="relative flex-1 py-3 rounded-2xl bg-taxi-gray text-taxi-dark font-semibold">
                <Icon name="MessageCircle" size={16} className="inline mr-2" />
                Чат
                {unread > 0 && (
                  <span className="absolute top-2 right-3 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{unread}</span>
                )}
              </button>
              <button onClick={handleCancel} className="px-4 py-3 rounded-2xl bg-taxi-gray text-taxi-muted font-semibold text-sm">
                ✕
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
                <p className="text-sm font-medium">149 ₽</p>
              </div>
            </div>
            <div className="w-full bg-taxi-gray rounded-full h-2 mb-3">
              <div className="bg-taxi-yellow h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
            <button onClick={openChat} className="relative w-full py-3 rounded-2xl bg-taxi-gray text-taxi-dark font-semibold text-sm flex items-center justify-center gap-2">
              <Icon name="MessageCircle" size={16} />
              Написать водителю
              {unread > 0 && (
                <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold ml-1">{unread}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
