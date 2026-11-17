"use client";

import type { ButtonProps, CardProps, ChipProps, MeterProps, SwitchProps, TagProps, ToastProps } from "@/types";
import { Icon } from "./icon";

export function Card({ className = "", ...props }: CardProps) {
  return <div className={`rw-card ${className}`} {...props} />;
}

export function Button({ className = "", variant = "default", status = "idle", disabled, children, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`rw-button rw-button--${variant} ${className}`} disabled={disabled || status === "running"} aria-busy={status === "running"} {...props}>{children}</button>;
}

export function Chip({ className = "", ...props }: ChipProps) {
  return <span className={`rw-chip ${className}`} {...props} />;
}

export function Tag({ className = "", dotColor, children, ...props }: TagProps) {
  return <span className={`rw-tag ${className}`} {...props}>{dotColor && <span className="rw-tag-dot" style={{ backgroundColor: dotColor }} />}{children}</span>;
}

export function Switch({ id, label, checked, disabled, onCheckedChange }: SwitchProps) {
  return <button id={id} className="rw-switch" type="button" role="switch" aria-label={label} aria-checked={checked} disabled={disabled} onClick={() => onCheckedChange(!checked)}><span /></button>;
}

export function Meter({ label, value, max }: MeterProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(value, safeMax)) : 0;
  return <div className="rw-meter" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue}><span style={{ width: `${safeValue / safeMax * 100}%` }} /></div>;
}

export function Toast({ open, message, tone = "info", onDismiss }: ToastProps) {
  return <div className={`rw-toast-region rw-toast-region--${tone}`} role={tone === "error" ? "alert" : "status"} aria-atomic="true">{open && <div className="rw-toast"><p>{message}</p><button type="button" aria-label="Dismiss notification" onClick={onDismiss}><Icon name="close" /></button></div>}</div>;
}
