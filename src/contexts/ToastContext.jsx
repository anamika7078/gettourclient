import { createContext, useCallback, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info", // info | success | warning | error
    duration: 2500,
  });

  const hide = useCallback(() => setToast((t) => ({ ...t, open: false })), []);

  const show = useCallback(
    (opts) => {
      const { message = "", type = "info", duration = 2500 } = opts || {};
      setToast({ open: true, message, type, duration });
      if (duration > 0) {
        window.clearTimeout(show._tid);
        show._tid = window.setTimeout(() => {
          setToast((t) => ({ ...t, open: false }));
        }, duration);
      }
      return () => hide();
    },
    [hide]
  );

  const value = useMemo(
    () => ({ showToast: show, hideToast: hide }),
    [show, hide]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastOverlay toast={toast} onClose={hide} />
    </ToastContext.Provider>
  );
}

function ToastOverlay({ toast, onClose }) {
  const { open, message, type } = toast || {};
  if (!open) return null;

  const palette = {
    info: {
      ring: "ring-blue-500/20",
      iconBg: "bg-blue-100 text-blue-600",
      text: "text-neutral-800",
      accent: "text-blue-600",
    },
    success: {
      ring: "ring-emerald-500/20",
      iconBg: "bg-emerald-100 text-emerald-600",
      text: "text-neutral-800",
      accent: "text-emerald-600",
    },
    warning: {
      ring: "ring-amber-500/20",
      iconBg: "bg-amber-100 text-amber-700",
      text: "text-neutral-800",
      accent: "text-amber-700",
    },
    error: {
      ring: "ring-red-500/20",
      iconBg: "bg-red-100 text-red-600",
      text: "text-neutral-800",
      accent: "text-red-600",
    },
  }[type || "info"];

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center px-4 py-10">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ${palette.ring} p-5 animate-[fadeIn_.18s_ease-out]`}
        role="alertdialog"
        aria-live="assertive"
        aria-modal="true"
      >
        <div className="flex items-start gap-3">
          <span
            className={`inline-grid h-9 w-9 place-items-center rounded-lg ${palette.iconBg}`}
          >
            {type === "success" ? (
              <CheckIcon className="h-5 w-5" />
            ) : type === "error" ? (
              <ErrorIcon className="h-5 w-5" />
            ) : type === "warning" ? (
              <WarnIcon className="h-5 w-5" />
            ) : (
              <InfoIcon className="h-5 w-5" />
            )}
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${palette.text}`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 inline-grid h-8 w-8 place-items-center rounded-md text-neutral-500 hover:text-neutral-800"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ErrorIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
      <path
        d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function WarnIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
      <path
        d="M10.2 4.6 2.9 17.3A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.7L13.8 4.6a2 2 0 0 0-3.6 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function InfoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 10v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
      <path
        d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ToastContext;
