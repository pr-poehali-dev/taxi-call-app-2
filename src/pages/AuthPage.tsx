import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface AuthPageProps {
  onAuth: () => void;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const codeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length <= 1) return "+7";
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSendCode = () => {
    if (phone.replace(/\D/g, "").length < 11) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("code");
      setResendTimer(30);
      setTimeout(() => codeRefs[0].current?.focus(), 100);
    }, 1200);
  };

  const handleCodeChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 3) codeRefs[i + 1].current?.focus();
    if (next.every(d => d !== "") && digit) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onAuth();
      }, 800);
    }
  };

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      codeRefs[i - 1].current?.focus();
    }
  };

  const handleResend = () => {
    setCode(["", "", "", ""]);
    setResendTimer(30);
    codeRefs[0].current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Hero */}
      <div className="bg-taxi-dark flex-shrink-0 px-6 pt-14 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-taxi-yellow opacity-10 translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white opacity-5 -translate-x-8 translate-y-8" />
        <div className="relative z-10">
          <div className="w-14 h-14 bg-taxi-yellow rounded-2xl flex items-center justify-center text-2xl mb-5 animate-scale-in">
            🚕
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">
            {step === "phone" ? "Добро\nпожаловать" : "Введите код"}
          </h1>
          <p className="text-taxi-muted text-sm animate-fade-in">
            {step === "phone"
              ? "Введите номер телефона для входа"
              : `Мы отправили SMS на номер ${phone}`}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        {step === "phone" ? (
          <div className="animate-fade-in flex flex-col flex-1">
            <label className="text-xs font-semibold text-taxi-muted uppercase tracking-wide mb-2">
              Номер телефона
            </label>
            <div className="flex items-center gap-3 border-2 border-border rounded-2xl px-4 py-4 mb-3 focus-within:border-taxi-yellow transition-colors">
              <Icon name="Phone" size={18} className="text-taxi-muted flex-shrink-0" />
              <input
                className="flex-1 text-base text-taxi-dark outline-none placeholder:text-taxi-muted bg-transparent"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={handlePhoneChange}
                inputMode="tel"
                onKeyDown={e => e.key === "Enter" && handleSendCode()}
              />
            </div>
            <p className="text-xs text-taxi-muted mb-8">
              Нажимая «Продолжить», вы соглашаетесь с условиями использования
            </p>
            <div className="mt-auto">
              <button
                onClick={handleSendCode}
                disabled={phone.replace(/\D/g, "").length < 11 || loading}
                className="w-full py-4 rounded-2xl bg-taxi-dark text-white font-semibold text-base transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Отправляем...
                  </>
                ) : "Продолжить"}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col flex-1">
            <label className="text-xs font-semibold text-taxi-muted uppercase tracking-wide mb-4">
              Код из SMS
            </label>
            <div className="flex gap-3 mb-6">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={codeRefs[i]}
                  className={`flex-1 h-16 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all ${
                    digit ? "border-taxi-yellow bg-amber-50 text-taxi-dark" : "border-border text-taxi-dark"
                  } focus:border-taxi-yellow`}
                  value={digit}
                  onChange={e => handleCodeChange(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                />
              ))}
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 py-3 animate-fade-in">
                <div className="w-4 h-4 border-2 border-taxi-yellow/30 border-t-taxi-yellow rounded-full animate-spin" />
                <span className="text-sm text-taxi-muted">Проверяем код...</span>
              </div>
            )}

            <div className="mt-auto space-y-3">
              {resendTimer > 0 ? (
                <p className="text-center text-sm text-taxi-muted">
                  Отправить снова через <span className="font-semibold text-taxi-dark">{resendTimer} сек</span>
                </p>
              ) : (
                <button onClick={handleResend} className="w-full py-3 rounded-2xl bg-taxi-gray text-taxi-dark font-medium text-sm">
                  Отправить код повторно
                </button>
              )}
              <button
                onClick={() => { setStep("phone"); setCode(["", "", "", ""]); }}
                className="w-full py-3 rounded-2xl border border-border text-taxi-muted text-sm"
              >
                Изменить номер
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
