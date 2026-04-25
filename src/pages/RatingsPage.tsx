import { useState } from "react";
import Icon from "@/components/ui/icon";

const drivers = [
  {
    id: 1,
    name: "Михаил Петров",
    rating: 4.9,
    trips: 3241,
    car: "Toyota Camry",
    plate: "А 123 МК",
    avatar: "👨",
    tags: ["Тихая езда", "Вежливый", "Чистый салон"],
    reviews: [
      { user: "Анна К.", text: "Отличный водитель, очень вежливый и аккуратный!", rating: 5, date: "22 апр" },
      { user: "Сергей В.", text: "Приехал быстро, помог с багажом.", rating: 5, date: "20 апр" },
      { user: "Ольга М.", text: "Немного превысил скорость, но в целом всё хорошо.", rating: 4, date: "18 апр" },
    ],
  },
  {
    id: 2,
    name: "Дмитрий Соколов",
    rating: 4.7,
    trips: 1876,
    car: "Kia Optima",
    plate: "В 456 НП",
    avatar: "👤",
    tags: ["Пунктуальный", "Разговорчивый"],
    reviews: [
      { user: "Павел Р.", text: "Хороший водитель, знает дорогу.", rating: 5, date: "23 апр" },
      { user: "Мария С.", text: "Опоздал на 5 минут, но предупредил заранее.", rating: 4, date: "19 апр" },
    ],
  },
  {
    id: 3,
    name: "Алексей Иванов",
    rating: 4.8,
    trips: 2109,
    car: "Skoda Octavia",
    plate: "К 789 ОС",
    avatar: "🧔",
    tags: ["Тихая музыка", "Чистый салон", "Пунктуальный"],
    reviews: [
      { user: "Елена Б.", text: "Замечательная поездка! Чисто, комфортно.", rating: 5, date: "24 апр" },
      { user: "Игорь Т.", text: "Знает хорошие маршруты объезда пробок.", rating: 5, date: "21 апр" },
    ],
  },
];

const RatingsPage = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "top">("all");

  const filtered = filter === "top" ? drivers.filter(d => d.rating >= 4.8) : drivers;
  const selectedDriver = drivers.find(d => d.id === selected);

  if (selectedDriver) {
    return (
      <div className="flex flex-col h-full bg-white animate-fade-in">
        <div className="px-5 pt-6 pb-4 border-b border-border">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-taxi-muted mb-4">
            <Icon name="ChevronLeft" size={20} />
            <span className="text-sm">Назад</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-taxi-gray flex items-center justify-center text-3xl">
              {selectedDriver.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-taxi-dark">{selectedDriver.name}</h2>
              <p className="text-sm text-taxi-muted">{selectedDriver.car} · {selectedDriver.plate}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-taxi-gray rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-taxi-dark">{selectedDriver.rating}</p>
              <p className="text-xs text-taxi-muted">Рейтинг</p>
            </div>
            <div className="bg-taxi-gray rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-taxi-dark">{(selectedDriver.trips / 1000).toFixed(1)}K</p>
              <p className="text-xs text-taxi-muted">Поездок</p>
            </div>
            <div className="bg-taxi-yellow rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-taxi-dark">★</p>
              <p className="text-xs text-taxi-dark font-medium">Топ водитель</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedDriver.tags.map(tag => (
              <span key={tag} className="text-xs bg-taxi-gray px-3 py-1.5 rounded-xl text-taxi-dark font-medium">{tag}</span>
            ))}
          </div>

          {/* Rating distribution */}
          <div className="mb-5">
            <p className="font-semibold text-taxi-dark mb-3">Оценки</p>
            {[5, 4, 3, 2, 1].map(star => {
              const pct = star === 5 ? 72 : star === 4 ? 21 : star === 3 ? 5 : 2;
              return (
                <div key={star} className="flex items-center gap-3 mb-1.5">
                  <span className="text-sm text-taxi-muted w-4">{star}</span>
                  <Icon name="Star" size={12} className="text-taxi-yellow fill-taxi-yellow" />
                  <div className="flex-1 bg-taxi-gray rounded-full h-2">
                    <div className="bg-taxi-yellow h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-taxi-muted w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Reviews */}
          <p className="font-semibold text-taxi-dark mb-3">Отзывы</p>
          <div className="space-y-3">
            {selectedDriver.reviews.map((review, i) => (
              <div key={i} className="bg-taxi-gray rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm">👤</div>
                    <span className="text-sm font-semibold text-taxi-dark">{review.user}</span>
                  </div>
                  <span className="text-xs text-taxi-muted">{review.date}</span>
                </div>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={j < review.rating ? "star-filled text-sm" : "star-empty text-sm"}>★</span>
                  ))}
                </div>
                <p className="text-sm text-taxi-dark">{review.text}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-4 rounded-2xl bg-taxi-dark text-white font-semibold">
            Выбрать водителя
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-5 pt-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-taxi-dark mb-1">Водители</h1>
        <p className="text-sm text-taxi-muted mb-3">Рейтинги и отзывы</p>
        <div className="flex gap-2">
          {(["all", "top"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f ? "bg-taxi-dark text-white" : "bg-taxi-gray text-taxi-muted"
              }`}
            >
              {f === "all" ? "Все" : "★ Топ"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {filtered.map(driver => (
          <button
            key={driver.id}
            onClick={() => setSelected(driver.id)}
            className="w-full text-left bg-white border border-border rounded-2xl p-4 card-hover"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-taxi-gray flex items-center justify-center text-2xl flex-shrink-0">
                {driver.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-taxi-dark">{driver.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-taxi-yellow text-sm">★</span>
                    <span className="font-bold text-taxi-dark text-sm">{driver.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-taxi-muted">{driver.car} · {driver.plate}</p>
                <p className="text-xs text-taxi-muted mt-1">{driver.trips.toLocaleString()} поездок</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {driver.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-taxi-gray px-2 py-0.5 rounded-lg text-taxi-muted">{tag}</span>
                  ))}
                </div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-taxi-muted flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingsPage;
