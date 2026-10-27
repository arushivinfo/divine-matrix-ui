"use client";

import { useId } from "react";

export function DayPicker({ value, onChange, label = "Date" }: { value: string; onChange: (day: string) => void; label?: string }) {
  const id = useId();
  return (
    <div className="flex items-center gap-3 rounded-full border border-line bg-white py-1.5 pr-2 pl-4">
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="min-h-9 rounded-full border-none bg-paper px-3 font-mono text-sm text-ink"
      />
    </div>
  );
}
