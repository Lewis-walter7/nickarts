'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

type ToastKind = 'success' | 'error';

interface Toast {
    id: number;
    kind: ToastKind;
    message: string;
}

interface ConfirmRequest {
    title: string;
    body?: string;
    confirmLabel?: string;
    destructive?: boolean;
}

interface FeedbackApi {
    toast: (kind: ToastKind, message: string) => void;
    confirm: (request: ConfirmRequest) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackApi | null>(null);

const TOAST_DURATION_MS = 5000;

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [pending, setPending] = useState<ConfirmRequest | null>(null);
    const nextId = useRef(0);
    const resolver = useRef<((ok: boolean) => void) | null>(null);

    const toast = useCallback((kind: ToastKind, message: string) => {
        const id = nextId.current++;
        setToasts((current) => [...current, { id, kind, message }]);
        setTimeout(() => {
            setToasts((current) => current.filter((t) => t.id !== id));
        }, TOAST_DURATION_MS);
    }, []);

    const confirm = useCallback((request: ConfirmRequest) => {
        setPending(request);
        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    const settle = useCallback((ok: boolean) => {
        resolver.current?.(ok);
        resolver.current = null;
        setPending(null);
    }, []);

    return (
        <FeedbackContext.Provider value={{ toast, confirm }}>
            {children}
            <ToastStack toasts={toasts} onDismiss={(id) =>
                setToasts((current) => current.filter((t) => t.id !== id))
            } />
            {pending && <ConfirmDialog request={pending} onSettle={settle} />}
        </FeedbackContext.Provider>
    );
}

export function useFeedback(): FeedbackApi {
    const api = useContext(FeedbackContext);
    if (!api) throw new Error('useFeedback must be used inside a FeedbackProvider');
    return api;
}

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
    return (
        <div
            aria-live="polite"
            className="fixed bottom-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 sm:max-w-sm"
        >
            {toasts.map((t) => (
                <div
                    key={t.id}
                    role={t.kind === 'error' ? 'alert' : 'status'}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-md ${t.kind === 'error'
                        ? 'border-red-500/30 bg-red-950/80 text-red-200'
                        : 'border-emerald-500/30 bg-emerald-950/80 text-emerald-200'
                        }`}
                >
                    <span className="flex-1">{t.message}</span>
                    <button
                        onClick={() => onDismiss(t.id)}
                        aria-label="Dismiss notification"
                        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity focus-ring rounded"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>
            ))}
        </div>
    );
}

function ConfirmDialog({
    request,
    onSettle,
}: {
    request: ConfirmRequest;
    onSettle: (ok: boolean) => void;
}) {
    const confirmRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        confirmRef.current?.focus();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onSettle(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onSettle]);

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => onSettle(false)}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
            >
                <h2 id="confirm-title" className="text-lg font-bold text-white">
                    {request.title}
                </h2>
                {request.body && (
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{request.body}</p>
                )}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => onSettle(false)}
                        className="flex-1 rounded-xl border border-zinc-700 py-3 font-bold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white focus-ring"
                    >
                        Cancel
                    </button>
                    <button
                        ref={confirmRef}
                        onClick={() => onSettle(true)}
                        className={`flex-1 rounded-xl py-3 font-bold transition-colors focus-ring ${request.destructive
                            ? 'bg-red-600 text-white hover:bg-red-500'
                            : 'bg-primary text-dark hover:bg-primary-hover'
                            }`}
                    >
                        {request.confirmLabel ?? 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}
