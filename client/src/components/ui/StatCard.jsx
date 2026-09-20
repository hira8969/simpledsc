import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  trend,
  className = ''
}) => {
  const colorSchemes = {
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      accent: 'text-indigo-600'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      accent: 'text-emerald-600'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      accent: 'text-purple-600'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      accent: 'text-amber-600'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      accent: 'text-rose-600'
    },
    navy: {
      bg: 'bg-slate-900 text-white border-slate-800',
      accent: 'text-slate-900'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;

  return (
    <div
      className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-card card-hover flex items-start justify-between gap-4 ${className}`}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {value}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 pt-0.5">{subtitle}</p>}
        {trend && (
          <div className="flex items-center gap-1 text-xs font-semibold pt-1">
            <span className={trend > 0 ? 'text-emerald-600' : 'text-rose-600'}>
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${scheme.bg}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
