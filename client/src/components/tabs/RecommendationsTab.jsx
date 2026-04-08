import { useState } from 'react';
import { getRecommendations } from '../../utils/recommendations';
import { getPhaseColor } from '../../utils/cycleUtils';
import EnergyArc from '../EnergyArc';

function StarRating({ stars, color }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= stars ? color : 'rgba(255,255,255,0.15)', fontSize: 12 }}>★</span>
      ))}
    </div>
  );
}

function WisdomCard({ wisdom, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span>🌿</span>
          <div className="text-left">
            <div className="text-xs font-semibold" style={{ color }}>Prevention & Balance</div>
            <div className="text-[10px] text-white/40">{wisdom.theme}</div>
          </div>
        </div>
        <span className="text-white/30 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul className="px-4 pb-4 space-y-2">
          {wisdom.prevention.map((tip, i) => (
            <li key={i} className="text-xs text-white/65 leading-relaxed flex gap-2">
              <span style={{ color, flexShrink: 0 }}>✦</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ExpandableSection({ title, icon, stars, green, avoid, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-cosmic-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="font-medium text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <StarRating stars={stars} color={color} />
          <span className="text-white/30 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {green.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-green-400 mb-1.5 flex items-center gap-1">
                <span>✓</span> Green light
              </div>
              <ul className="space-y-1">
                {green.map((item, i) => (
                  <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                    <span className="text-green-400/60 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {avoid.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-red-400/80 mb-1.5 flex items-center gap-1">
                <span>✗</span> Consider avoiding
              </div>
              <ul className="space-y-1">
                {avoid.map((item, i) => (
                  <li key={i} className="text-xs text-white/50 flex items-start gap-1.5">
                    <span className="text-red-400/50 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RecommendationsTab({ cycleInfo, dayPatterns }) {
  if (!cycleInfo) {
    return (
      <div className="p-6 text-center text-white/40 text-sm">
        <div className="text-2xl mb-2">🌑</div>
        Set your cycle start date in Settings to unlock personalized recommendations.
      </div>
    );
  }

  const rec = getRecommendations(cycleInfo.phase, dayPatterns, cycleInfo.cycleDay);
  const color = getPhaseColor(cycleInfo.phase);

  const sections = [
    { key: 'work', title: 'Work & Focus', icon: '💼', ...rec.work },
    { key: 'social', title: 'Social Life', icon: '🌸', ...rec.social },
    { key: 'selfCare', title: 'Self-Care', icon: '🛁', ...rec.selfCare },
    { key: 'creative', title: 'Creative Energy', icon: '🎨', ...rec.creative },
    { key: 'fitness', title: 'Fitness', icon: '🏃', ...rec.fitness },
  ];

  return (
    <div className="p-4 space-y-3">
      {/* Phase intro */}
      <div className="rounded-lg p-3 text-xs" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <span className="font-semibold" style={{ color }}>
          {cycleInfo.phase.charAt(0).toUpperCase() + cycleInfo.phase.slice(1)} phase
        </span>
        <span className="text-white/50"> · Day {cycleInfo.cycleDay}</span>
        {dayPatterns.length > 0 && (
          <span className="text-white/40"> · {dayPatterns.length} personal adjustment{dayPatterns.length > 1 ? 's' : ''} applied</span>
        )}
      </div>

      {/* Week ahead energy arc */}
      <EnergyArc />

      {/* Prevention wisdom card */}
      {rec.wisdom && <WisdomCard wisdom={rec.wisdom} color={color} />}

      {sections.map(({ key, ...s }) => (
        <ExpandableSection key={key} color={color} {...s} />
      ))}

      {/* Food & nourishment */}
      <div className="border border-cosmic-border rounded-lg p-4">
        <div className="text-sm font-medium mb-3 flex items-center gap-2">
          <span>🥗</span> Food & Nourishment
        </div>
        <div className="flex flex-wrap gap-1.5">
          {rec.food.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ background: `${item.color}20`, border: `1px solid ${item.color}45` }}
            >
              <span className="text-xs font-medium" style={{ color: item.color }}>{item.name}</span>
              <span className="text-[10px] text-white/35">{item.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
