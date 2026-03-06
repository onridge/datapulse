"use client";

import { useMemo } from "react";

type Strength = {
  score: number;
  label: string;
  color: string;
  segments: number;
};

const getStrength = (password: string): Strength => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Too weak", color: "#ef4444", segments: 1 };
  if (score === 2) return { score, label: "Weak", color: "#f97316", segments: 2 };
  if (score === 3)
    return {
      score,
      label: "Medium strength — add symbols to make it stronger",
      color: "#eab308",
      segments: 3,
    };
  if (score === 4) return { score, label: "Strong", color: "#22c55e", segments: 4 };
  return { score, label: "Very strong", color: "#22c55e", segments: 5 };
};

export const PasswordStrength = ({ password }: { password: string }) => {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 99,
              background: i < strength.segments ? strength.color : "var(--border2)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 12, color: strength.color }}>{strength.label}</p>
    </div>
  );
};
