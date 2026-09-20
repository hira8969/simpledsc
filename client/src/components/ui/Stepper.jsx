import React from 'react';
import { Check } from 'lucide-react';

export const Stepper = ({ steps = [], activeStep = 0, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto pb-2 ${className}`}>
      <div className="flex items-center justify-between min-w-[500px] sm:min-w-0">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center relative group">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-2 font-medium text-center whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-indigo-600 font-semibold'
                      : isCompleted
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.title || step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-5 transition-all duration-300 ${
                    idx < activeStep ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
