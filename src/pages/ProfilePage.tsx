import { useState } from "react";
import Icon from "@/components/ui/icon";

const ProfilePage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMap, setDarkMap] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Александр Смирнов");
  const [phone, setPhone] = useState("+7 (999) 123-45-67");
  const [email, setEmail] = useState("alex@mail.ru");

  const stats = [
    { label: "Поездок", value: "42" },
    { label: "Рейтинг", value: "4.8 ★" },
    { label: "Потрачено", value: "18 400 ₽" },
  ];

  const menuItems: { icon: string; label: string; toggle: boolean; value: boolean; onChange: () => void }[] = [
    { icon: "Bell", label: "Уведомления", toggle: true, value: notifications, onChange: () => setNotifications(!notifications) },
    { icon: "Map", label: "Тёмная карта", toggle: true, value: darkMap, onChange: () => setDarkMap(!darkMap) },
    { icon: "MapPin", label: "Делиться геолокацией", toggle: true, value: shareLocation, onChange: () => setShareLocation(!shareLocation) },
  ];

  const links: { icon: string; label: string }[] = [
    { icon: "HelpCircle", label: "Помощь и поддержка" },
    { icon: "Shield", label: "Безопасность" },
    { icon: "FileText", label: "Условия использования" },
    { icon: "Star", label: "Оценить приложение" },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="bg-taxi-dark px-5 pt-8 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white opacity-5 translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-taxi-yellow opacity-10 -translate-x-8 translate-y-8" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-taxi-yellow flex items-center justify-center text-3xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <p className="text-taxi-muted text-sm">{phone}</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
          >
            <Icon name={editing ? "X" : "Pen"} size={16} className="text-white" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-5 relative z-10">
          {stats.map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white font-bold text-lg">{s.value}</p>
              <p className="text-taxi-muted text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 flex-1">
        {/* Edit form */}
        {editing && (
          <div className="bg-taxi-gray rounded-2xl p-4 mb-4 animate-fade-in">
            <p className="font-semibold text-taxi-dark mb-3">Редактировать профиль</p>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-taxi-muted mb-1 block">Имя</label>
                <input
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-taxi-yellow bg-white"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-taxi-muted mb-1 block">Телефон</label>
                <input
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-taxi-yellow bg-white"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-taxi-muted mb-1 block">Email</label>
                <input
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-taxi-yellow bg-white"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => setEditing(false)}
              className="w-full mt-3 py-3 rounded-xl bg-taxi-dark text-white font-semibold text-sm"
            >
              Сохранить
            </button>
          </div>
        )}

        {/* Promo */}
        <div className="bg-taxi-yellow rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-taxi-dark flex items-center justify-center">
            <Icon name="Gift" size={18} className="text-taxi-yellow" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-taxi-dark text-sm">Пригласи друга</p>
            <p className="text-xs text-taxi-dark/70">Получи 300 ₽ за каждого</p>
          </div>
          <Icon name="ChevronRight" size={18} className="text-taxi-dark" />
        </div>

        {/* Settings toggles */}
        <p className="text-xs font-semibold text-taxi-muted uppercase tracking-wide mb-3">Настройки</p>
        <div className="bg-taxi-gray rounded-2xl overflow-hidden mb-4">
          {menuItems.map((item, i) => (
            <div key={item.label}>
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Icon name={item.icon} size={16} className="text-taxi-dark" />
                </div>
                <span className="flex-1 text-sm font-medium text-taxi-dark">{item.label}</span>
                <button
                  onClick={item.onChange}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    item.value ? "bg-taxi-dark" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      item.value ? "left-7" : "left-1"
                    }`}
                  />
                  {item.value && (
                    <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-taxi-yellow" />
                  )}
                </button>
              </div>
              {i < menuItems.length - 1 && <div className="border-t border-white mx-4" />}
            </div>
          ))}
        </div>

        {/* Links */}
        <p className="text-xs font-semibold text-taxi-muted uppercase tracking-wide mb-3">Другое</p>
        <div className="bg-taxi-gray rounded-2xl overflow-hidden mb-4">
          {links.map((item, i) => (
            <div key={item.label}>
              <button className="w-full flex items-center gap-3 px-4 py-4">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Icon name={item.icon} size={16} className="text-taxi-dark" />
                </div>
                <span className="flex-1 text-sm font-medium text-taxi-dark text-left">{item.label}</span>
                <Icon name="ChevronRight" size={16} className="text-taxi-muted" />
              </button>
              {i < links.length - 1 && <div className="border-t border-white mx-4" />}
            </div>
          ))}
        </div>

        <button className="w-full py-4 rounded-2xl border-2 border-destructive/30 text-destructive text-sm font-semibold mb-8">
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;