import { useState } from "react";
import Icon from "@/components/ui/icon";

const slides = [
  {
    emoji: "🗺️",
    title: "Такси\nрядом с вами",
    desc: "Видите машины на карте в реальном времени — следите за водителем от момента заказа до посадки",
    color: "bg-taxi-dark",
    textColor: "text-white",
    mutedColor: "text-taxi-muted",
    dotActive: "bg-taxi-yellow",
    dotInactive: "bg-white/20",
  },
  {
    emoji: "⚡",
    title: "Быстрый\nзаказ",
    desc: "Введите адрес — водитель приедет за считанные минуты. Никаких лишних шагов",
    color: "bg-taxi-yellow",
    textColor: "text-taxi-dark",
    mutedColor: "text-taxi-dark/60",
    dotActive: "bg-taxi-dark",
    dotInactive: "bg-taxi-dark/20",
  },
  {
    emoji: "💳",
    title: "Удобная\nоплата",
    desc: "Карта, кошелёк или наличные — платите как вам удобно. Чек всегда под рукой в истории",
    color: "bg-white",
    textColor: "text-taxi-dark",
    mutedColor: "text-taxi-muted",
    dotActive: "bg-taxi-dark",
    dotInactive: "bg-border",
  },
];

interface OnboardingPageProps {
  onDone: () => void;
}

const OnboardingPage = ({ onDone }: OnboardingPageProps) => {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const next = () => {
    if (isLast) onDone();
    else setCurrent(c => c + 1);
  };

  return (
    <div className={`flex flex-col h-full ${slide.color} transition-colors duration-500`}>
      {/* Skip */}
      <div className="flex justify-end px-5 pt-5">
        <button onClick={onDone} className={`text-sm font-medium ${slide.mutedColor}`}>
          Пропустить
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div
          key={current}
          className="text-8xl mb-10 animate-scale-in"
        >
          {slide.emoji}
        </div>
        <h1
          key={`title-${current}`}
          className={`text-4xl font-bold text-center leading-tight mb-4 whitespace-pre-line animate-fade-in ${slide.textColor}`}
        >
          {slide.title}
        </h1>
        <p
          key={`desc-${current}`}
          className={`text-center text-base leading-relaxed animate-fade-in ${slide.mutedColor}`}
        >
          {slide.desc}
        </p>
      </div>

      {/* Bottom */}
      <div className="px-6 pb-10">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? `w-6 h-2 ${slide.dotActive}`
                  : `w-2 h-2 ${slide.dotInactive}`
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
            slide.color === "bg-taxi-yellow"
              ? "bg-taxi-dark text-white"
              : slide.color === "bg-white"
              ? "bg-taxi-dark text-white"
              : "bg-taxi-yellow text-taxi-dark"
          }`}
        >
          {isLast ? "Начать" : "Далее"}
          <Icon name={isLast ? "ArrowRight" : "ChevronRight"} size={18} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
