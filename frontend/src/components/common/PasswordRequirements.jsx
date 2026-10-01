import React from 'react';
import { Check, X } from 'lucide-react';

export const PasswordRequirements = ({ password = '' }) => {
  const hasLength = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const rules = [
    { label: '8 to 16 characters long', passed: hasLength },
    { label: 'At least one uppercase letter (A-Z)', passed: hasUppercase },
    { label: 'At least one special character (!@#$%^&*...)', passed: hasSpecial },
  ];

  if (!password) {
    return (
      <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <p className="font-semibold text-slate-600 mb-1.5">Password requirements:</p>
        <ul className="space-y-1">
          {rules.map((rule, idx) => (
            <li key={idx} className="flex items-center gap-1.5 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              {rule.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
      <p className="font-semibold text-slate-600 mb-1.5">Password strength criteria:</p>
      <ul className="space-y-1">
        {rules.map((rule, idx) => (
          <li
            key={idx}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              rule.passed ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {rule.passed ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
