import { useState } from "react";
import Icon from "@/components/ui/icon";

const trips = [
  { id: 1, date: "Сегодня, 14:32", from: "Тверская, 12", to: "Аэропорт Шереметьево", price: 1240, class: "Эконом", rating: 5 },
  { id: 2, date: "Вчера, 09:15", from: "Дом", to: "Офис на Садовой", price: 249, class: "Эконом", rating: 4 },
  { id: 3, date: "22 апреля, 20:44", from: "Торговый центр", to: "Парк Горького", price: 320, class: "Эконом", rating: 5 },
  { id: 4, date: "20 апреля, 11:00", from: "Отель Метрополь", to: "Вокзал", price: 580, class: "Эконом", rating: 4 },
];

const cards = [
  { id: 1, type: "visa", last4: "4242", label: "Visa", active: true },
  { id: 2, type: "mastercard", last4: "8731", label: "Mastercard", active: false },
];

const drivers = ["Михаил П.", "Дмитрий С.", "Алексей И.", "Владимир К."];

const PaymentPage = () => {
  const [tab, setTab] = useState<"methods" | "history">("methods");
  const [selectedCard, setSelectedCard] = useState(1);
  const [addingCard, setAddingCard] = useState(false);
  const [reviewTripId, setReviewTripId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState<Set<number>>(new Set());

  const totalSpent = trips.reduce((s, t) => s + t.price, 0);

  const handleSubmitReview = (tripId: number) => {
    setSubmittedReviews(prev => new Set(prev).add(tripId));
    setReviewTripId(null);
    setReviewRating(0);
    setReviewText("");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-taxi-dark mb-1">Оплата</h1>
        <div className="flex gap-1 mt-3 bg-taxi-gray rounded-xl p-1">
          <button
            onClick={() => setTab("methods")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === "methods" ? "bg-white text-taxi-dark shadow-sm" : "text-taxi-muted"
            }`}
          >
            Способы
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === "history" ? "bg-white text-taxi-dark shadow-sm" : "text-taxi-muted"
            }`}
          >
            История
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {tab === "methods" && (
          <div className="animate-fade-in">
            {/* Balance card */}
            <div className="bg-taxi-dark rounded-2xl p-5 mb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white opacity-5 translate-x-12 -translate-y-12" />
              <p className="text-taxi-muted text-sm mb-1">Баланс кошелька</p>
              <p className="text-3xl font-bold text-white mb-3">1 250 ₽</p>
              <button className="bg-taxi-yellow text-taxi-dark text-sm font-semibold px-4 py-2 rounded-xl">
                Пополнить
              </button>
            </div>

            {/* Cards */}
            <p className="text-sm font-semibold text-taxi-muted mb-3 uppercase tracking-wide">Привязанные карты</p>
            <div className="space-y-3 mb-4">
              {cards.map(card => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    selectedCard === card.id ? "border-taxi-yellow bg-amber-50" : "border-border bg-white"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-taxi-gray flex items-center justify-center">
                    <Icon name="CreditCard" size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-taxi-dark">{card.label}</p>
                    <p className="text-sm text-taxi-muted">•••• {card.last4}</p>
                  </div>
                  {selectedCard === card.id && (
                    <div className="w-5 h-5 rounded-full bg-taxi-yellow flex items-center justify-center">
                      <Icon name="Check" size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Add card */}
            {addingCard ? (
              <div className="border border-border rounded-2xl p-4 animate-fade-in">
                <p className="font-semibold text-taxi-dark mb-3">Новая карта</p>
                <input className="w-full border border-border rounded-xl px-4 py-3 text-sm mb-2 outline-none focus:border-taxi-yellow" placeholder="Номер карты" />
                <div className="flex gap-2 mb-3">
                  <input className="flex-1 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-taxi-yellow" placeholder="ММ/ГГ" />
                  <input className="flex-1 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-taxi-yellow" placeholder="CVV" />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 rounded-xl bg-taxi-dark text-white text-sm font-semibold">Добавить</button>
                  <button onClick={() => setAddingCard(false)} className="flex-1 py-3 rounded-xl bg-taxi-gray text-taxi-muted text-sm">Отмена</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingCard(true)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border text-taxi-muted hover:border-taxi-yellow hover:text-taxi-dark transition-all"
              >
                <Icon name="Plus" size={18} />
                <span className="text-sm font-medium">Добавить карту</span>
              </button>
            )}

            {/* Pay methods */}
            <p className="text-sm font-semibold text-taxi-muted mt-5 mb-3 uppercase tracking-wide">Другие способы</p>
            <div className="space-y-2">
              {["SberPay", "Mir Pay", "Наличные"].map(method => (
                <button key={method} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-taxi-gray text-left">
                  <Icon name="Wallet" size={18} className="text-taxi-muted" />
                  <span className="text-sm font-medium text-taxi-dark">{method}</span>
                  <Icon name="ChevronRight" size={16} className="ml-auto text-taxi-muted" />
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="animate-fade-in">
            {/* Summary */}
            <div className="bg-taxi-gray rounded-2xl p-4 mb-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <Icon name="TrendingUp" size={20} className="text-taxi-dark" />
              </div>
              <div>
                <p className="text-sm text-taxi-muted">Потрачено за месяц</p>
                <p className="text-xl font-bold text-taxi-dark">{totalSpent.toLocaleString()} ₽</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-taxi-muted">Поездок</p>
                <p className="text-xl font-bold text-taxi-dark">{trips.length}</p>
              </div>
            </div>

            <div className="space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className="bg-white border border-border rounded-2xl p-4 card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-taxi-muted">{trip.date}</p>
                      <span className="inline-block text-xs bg-taxi-gray px-2 py-0.5 rounded-lg mt-1 text-taxi-muted">{trip.class}</span>
                    </div>
                    <p className="font-bold text-taxi-dark">{trip.price} ₽</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                      <p className="text-sm text-taxi-dark truncate">{trip.from}</p>
                    </div>
                    <div className="ml-1 w-px h-3 bg-border ml-1" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm bg-taxi-yellow flex-shrink-0" />
                      <p className="text-sm text-taxi-dark truncate">{trip.to}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    {submittedReviews.has(trip.id) ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Icon name="CheckCircle" size={14} />
                        <span className="text-xs font-medium">Отзыв отправлен</span>
                      </div>
                    ) : reviewTripId === trip.id ? (
                      <div className="animate-fade-in">
                        <p className="text-xs font-semibold text-taxi-dark mb-2">
                          Водитель: {drivers[trip.id - 1]}
                        </p>
                        <div className="flex gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setReviewRating(i + 1)}
                              className={`text-2xl transition-transform hover:scale-110 ${i < reviewRating ? "star-filled" : "star-empty"}`}
                            >★</button>
                          ))}
                        </div>
                        <textarea
                          className="w-full border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-taxi-yellow resize-none mb-2"
                          rows={2}
                          placeholder="Комментарий (необязательно)"
                          value={reviewText}
                          onChange={e => setReviewText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubmitReview(trip.id)}
                            disabled={reviewRating === 0}
                            className="flex-1 py-2 rounded-xl bg-taxi-dark text-white text-xs font-semibold disabled:opacity-40"
                          >
                            Отправить
                          </button>
                          <button
                            onClick={() => { setReviewTripId(null); setReviewRating(0); setReviewText(""); }}
                            className="px-4 py-2 rounded-xl bg-taxi-gray text-taxi-muted text-xs"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < trip.rating ? "star-filled text-sm" : "star-empty text-sm"}>★</span>
                          ))}
                        </div>
                        <button
                          onClick={() => { setReviewTripId(trip.id); setReviewRating(trip.rating); }}
                          className="text-xs text-taxi-dark font-medium bg-taxi-gray px-3 py-1.5 rounded-lg"
                        >
                          Оставить отзыв
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;