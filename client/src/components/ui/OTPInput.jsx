import React, { useRef, useEffect } from 'react';

export const OTPInput = ({ length = 6, value = '', onChange, disabled = false }) => {
  const inputRefs = useRef([]);

  // Ensure refs array has right size
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const otpDigits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleInputChange = (index, e) => {
    const val = e.target.value;
    if (disabled) return;

    // Only allow single digit numbers
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    // Auto advance to next input if digit entered
    if (cleaned && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      const nextFocus = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otpDigits[idx] || ''}
          onChange={(e) => handleInputChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          disabled={disabled}
          className="w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border border-slate-300 bg-white focus:bg-indigo-50/30 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
        />
      ))}
    </div>
  );
};
