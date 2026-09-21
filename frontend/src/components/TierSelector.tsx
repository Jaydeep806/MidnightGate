import React from 'react';
import { VerificationTier } from '../types';
import { ShieldCheck, Crown, Sparkles, Check } from 'lucide-react';

interface TierSelectorProps {
  tiers: VerificationTier[];
  selectedTier: VerificationTier;
  onSelectTier: (tier: VerificationTier) => void;
  disabled?: boolean;
}

export const TierSelector: React.FC<TierSelectorProps> = ({
  tiers,
  selectedTier,
  onSelectTier,
  disabled
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
        1. Select Verification Gate &amp; Required Threshold
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tiers.map((tier) => {
          const isSelected = selectedTier.id === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTier(tier)}
              className={`text-left p-4 rounded-2xl transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'glass-panel border-purple-500/60 ring-2 ring-purple-500/40 shadow-lg shadow-purple-950/60'
                  : 'glass-card hover:border-slate-600/50 hover:bg-midnight-900/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center">
                  <Check className="w-3 h-3 text-purple-300" />
                </div>
              )}

              <div className="flex items-center space-x-2.5 mb-2">
                <div className="p-1.5 rounded-lg bg-midnight-950/80 border border-slate-700/40">
                  {getIcon(tier.iconName)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{tier.name}</h3>
                  <span className="text-[10px] font-mono text-purple-300/80">{tier.badge}</span>
                </div>
              </div>

              <div className="my-2">
                <span className="text-xl font-extrabold text-white font-mono">
                  ${tier.thresholdUSD.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 ml-1 font-mono">USD min</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {tier.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
