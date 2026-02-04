import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordValidationProps {
  password: string;
  showValidation: boolean;
}

interface ValidationRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const validationRules: ValidationRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8
  },
  {
    id: 'uppercase',
    label: '1 capital letter (A-Z)',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase',
    label: '1 lowercase letter (a-z)',
    test: (password) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    label: '1 number (0-9)',
    test: (password) => /\d/.test(password)
  },
  {
    id: 'special',
    label: '1 special character (@$!%*?&)',
    test: (password) => /[@$!%*?&]/.test(password)
  }
];

export default function PasswordValidation({ password, showValidation }: PasswordValidationProps) {
  if (!showValidation) return null;

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
      <div className="space-y-1">
        {validationRules.map((rule) => {
          const isValid = rule.test(password);
          return (
            <div key={rule.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isValid 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {isValid ? (
                  <Check size={10} strokeWidth={3} />
                ) : (
                  <X size={10} strokeWidth={2} />
                )}
              </div>
              <span className={`text-xs ${
                isValid ? 'text-green-600 font-medium' : 'text-gray-500'
              }`}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const isPasswordValid = (password: string): boolean => {
  return validationRules.every(rule => rule.test(password));
};