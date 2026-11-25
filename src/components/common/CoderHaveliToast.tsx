'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Loader2, X } from 'lucide-react';

export type ToastVariant = 'default' | 'success' | 'error' | 'loading';

export interface ToastOptions {
  id?: string;
  duration?: number;
  icon?: React.ReactNode;
}

interface ToastItem {
  id: string;
  message: React.ReactNode;
  variant: ToastVariant;
  duration: number;
  icon?: React.ReactNode;
}

type Listener = (toasts: ToastItem[]) => void;

const listeners = new Set<Listener>();
let memoryToasts: ToastItem[] = [];
let idCounter = 0;

function notify() {
  const snapshot = [...memoryToasts];
  listeners.forEach((fn) => fn(snapshot));
}

function addToast(
  message: React.ReactNode,
  variant: ToastVariant = 'default',
  options: ToastOptions = {}
): string {
  const id = options.id || `ch-toast-${++idCounter}-${Date.now()}`;
  const duration =
    options.duration !== undefined
      ? options.duration
      : variant === 'loading'
        ? 60000
        : variant === 'error'
          ? 4500
          : 3500;

  // Replace existing toast if same id
  const existingIdx = memoryToasts.findIndex((t) => t.id === id);
  const nextItem: ToastItem = {
    id,
    message,
    variant,
    duration,
    icon: options.icon
  };

  if (existingIdx >= 0) {
    memoryToasts = memoryToasts.map((t, i) => (i === existingIdx ? nextItem : t));
  } else {
    memoryToasts = [...memoryToasts.slice(-3), nextItem]; // Keep max 4 visible toasts
  }
  notify();

  if (duration > 0 && duration !== Infinity && typeof window !== 'undefined') {
    window.setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
}

function dismissToast(id?: string) {
  if (!id) {
    memoryToasts = [];
  } else {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
  }
  notify();
}

export interface ToastFn {
  (message: React.ReactNode, options?: ToastOptions): string;
  success: (message: React.ReactNode, options?: ToastOptions) => string;
  error: (message: React.ReactNode, options?: ToastOptions) => string;
  loading: (message: React.ReactNode, options?: ToastOptions) => string;
  dismiss: (id?: string) => void;
  promise: <T>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string },
    options?: ToastOptions
  ) => Promise<T>;
}

const toastImpl = ((message: React.ReactNode, options?: ToastOptions) =>
  addToast(message, 'default', options)) as ToastFn;

toastImpl.success = (message, options) => addToast(message, 'success', options);
toastImpl.error = (message, options) => addToast(message, 'error', options);
toastImpl.loading = (message, options) => addToast(message, 'loading', options);
toastImpl.dismiss = (id) => dismissToast(id);
toastImpl.promise = async (promise, msgs, options) => {
  const id = addToast(msgs.loading, 'loading', options);
  try {
    const res = await promise;
    addToast(msgs.success, 'success', { ...options, id });
    return res;
  } catch (err) {
    addToast(msgs.error, 'error', { ...options, id });
    throw err;
  }
};

export const toast = toastImpl;

export function Toaster({ position = 'top-right' }: { position?: string }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener: Listener = (next) => setItems(next);
    listeners.add(listener);
    setItems([...memoryToasts]);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (items.length === 0) return null;

  const posClass =
    position === 'bottom-right'
      ? 'bottom-5 right-4 sm:right-5'
      : 'top-4 left-4 right-4 sm:left-auto sm:top-5 sm:right-5';

  return (
    <div
      className={`fixed ${posClass} z-[200] flex flex-col gap-2.5 w-auto sm:w-96 pointer-events-none`}
      aria-live="polite"
    >
      {items.map((item) => {
        const accentStyle =
          item.variant === 'success'
            ? 'border-l-4 border-l-emerald-500 border-emerald-200 dark:border-emerald-500/35'
            : item.variant === 'error'
              ? 'border-l-4 border-l-rose-500 border-rose-200 dark:border-rose-500/35'
              : 'border-l-4 border-l-amber-500 border-amber-200 dark:border-amber-500/40';

        const iconNode = item.icon ? (
          item.icon
        ) : item.variant === 'success' ? (
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        ) : item.variant === 'error' ? (
          <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
        ) : item.variant === 'loading' ? (
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );

        return (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto flex items-start justify-between gap-3 px-4 py-3 rounded-xl bg-white/95 dark:bg-[#131926]/95 backdrop-blur-md border ${accentStyle} shadow-lg dark:shadow-[0_10px_28px_rgba(0,0,0,0.65)] text-gray-900 dark:text-gray-100 transition-all duration-200`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              {iconNode}
              <div className="text-xs sm:text-sm font-semibold leading-snug break-words pt-0.5">
                {item.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(item.id)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 shrink-0 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default toast;

