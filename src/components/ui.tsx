"use client";

import clsx from "clsx";
import Link from "next/link";
import { forwardRef } from "react";

export function cn(...a: Parameters<typeof clsx>) {
  return clsx(...a);
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-[background,border-color,color,transform] duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none";
const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-strong shadow-soft",
  secondary: "bg-surface border border-line text-ink hover:border-line-2 hover:bg-surface-2",
  ghost: "text-ink-2 hover:text-ink hover:bg-surface-3",
  danger: "text-critical hover:bg-critical-soft",
};
const buttonSizes = { sm: "h-8 px-3", md: "h-10 px-4", lg: "h-11 px-5 text-[15px]" };

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: keyof typeof buttonSizes }
>(function Button({ variant = "secondary", size = "md", className, ...props }, ref) {
  return <button ref={ref} className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)} {...props} />;
});

export function ButtonLink({
  href,
  variant = "secondary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: keyof typeof buttonSizes;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}>
      {children}
    </Link>
  );
}

export function Card({ className, children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-line bg-surface shadow-card", className)} {...p}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">{eyebrow}</div>}
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

type Tone = "neutral" | "accent" | "safe" | "caution" | "critical";
const tones: Record<Tone, string> = {
  neutral: "bg-surface-3 text-ink-2",
  accent: "bg-accent-soft text-accent-strong",
  safe: "bg-safe-soft text-safe",
  caution: "bg-caution-soft text-caution",
  critical: "bg-critical-soft text-critical",
};

export function Badge({ tone = "neutral", dot, className, children }: { tone?: Tone; dot?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", tones[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {hint && <span className="mt-0.5 block text-xs font-normal text-ink-3">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-ink-3 transition-colors hover:border-line-2 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-soft";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cn(inputBase, "h-10", className)} {...p} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...p }, ref) {
  return <textarea ref={ref} className={cn(inputBase, "min-h-24 py-2.5 leading-relaxed", className)} {...p} />;
});

export function Select<T extends string>({
  value,
  onChange,
  options,
  id,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Record<T, string>;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={cn(inputBase, "h-10 appearance-none pr-9")}>
        {(Object.keys(options) as T[]).map((k) => (
          <option key={k} value={k}>
            {options[k]}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  tones: optionTones,
  name,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Record<T, string>;
  tones?: Partial<Record<T, Tone>>;
  name: string;
}) {
  const keys = Object.keys(options) as T[];
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-1.5 rounded-2xl bg-surface-3 p-1">
      {keys.map((k) => {
        const aktiv = k === value;
        const t = optionTones?.[k];
        return (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={aktiv}
            onClick={() => onChange(k)}
            className={cn(
              "flex-1 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition-all duration-150",
              aktiv
                ? cn(
                    "bg-surface font-medium shadow-soft",
                    t === "critical" ? "text-critical" : t === "caution" ? "text-caution" : "text-ink",
                  )
                : "text-ink-2 hover:text-ink",
            )}
          >
            {k === value && t && t !== "neutral" && (
              <span className={cn("mr-1.5 inline-block size-1.5 -translate-y-px rounded-full", t === "critical" ? "bg-critical" : t === "caution" ? "bg-caution" : "bg-safe")} />
            )}
            {options[k]}
          </button>
        );
      })}
    </div>
  );
}

export function Progress({ value, max, tone = "accent" }: { value: number; max: number; tone?: "accent" | "safe" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-300", tone === "safe" ? "bg-safe" : "bg-accent")}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

export function Empty({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-strong">{icon}</div>
      <div className="font-semibold">{title}</div>
      <p className="mt-1 max-w-sm text-sm text-ink-2">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
