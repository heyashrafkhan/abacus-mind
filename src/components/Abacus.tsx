import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AbacusProps {
  numRods?: number;
  value?: number;
  onChange?: (value: number) => void;
  interactive?: boolean;
  showLabels?: boolean;
  highlightRod?: number | null;
  opacity?: number;
}

interface RodState {
  heaven: boolean; // true = down (active)
  earth: number;   // 0-4, number of beads pushed up
}

export default function Abacus({
  numRods: initialNumRods = 3,
  value,
  onChange,
  interactive = true,
  showLabels = true,
  highlightRod = null,
  opacity = 1,
}: AbacusProps) {
  const [rods, setRods] = useState<RodState[]>(() =>
    Array.from({ length: initialNumRods }, () => ({ heaven: false, earth: 0 }))
  );

  // Dynamically calculate how many rods we actually need based on current state
  const computeValue = useCallback((rodStates: RodState[]) => {
    return rodStates.reduce((sum, rod, idx) => {
      const place = Math.pow(10, rodStates.length - 1 - idx);
      return sum + ((rod.heaven ? 5 : 0) + rod.earth) * place;
    }, 0);
  }, []);

  // Sync external value to rods AND expand rods if value is too large
  useEffect(() => {
    if (value === undefined) return;
    
    // Ensure at least one "buffer" rod to the left to allow for carries/complements
    // e.g., if value is 8, still show 2 rods (Tens and Ones) so user can add 10
    const currentDigits = Math.ceil(Math.log10(value + 1)) || 1;
    const requiredRods = Math.max(initialNumRods, currentDigits + 1);
    
    const newRods: RodState[] = [];
    let remaining = value;
    for (let i = 0; i < requiredRods; i++) {
      const place = Math.pow(10, requiredRods - 1 - i);
      const digit = Math.floor(remaining / place);
      remaining = remaining % place;
      newRods.push({
        heaven: digit >= 5,
        earth: digit >= 5 ? digit - 5 : digit,
      });
    }
    setRods(newRods);
  }, [value, initialNumRods]);

  const toggleHeaven = useCallback((rodIdx: number) => {
    if (!interactive) return;
    setRods(prev => {
      const updated = prev.map((rod, i) =>
        i === rodIdx ? { ...rod, heaven: !rod.heaven } : rod
      );
      onChange?.(computeValue(updated));
      return updated;
    });
  }, [interactive, onChange, computeValue]);

  const toggleEarth = useCallback((rodIdx: number, beadIdx: number) => {
    if (!interactive) return;
    setRods(prev => {
      const rod = prev[rodIdx];
      const newCount = beadIdx + 1;
      // Toggle: if beads are already up to this level, reset below; otherwise raise to this level
      const updatedRod = {
        ...rod,
        earth: rod.earth === newCount ? beadIdx : newCount,
      };
      const updated = prev.map((r, i) => (i === rodIdx ? updatedRod : r));
      onChange?.(computeValue(updated));
      return updated;
    });
  }, [interactive, onChange, computeValue]);

  const currentValue = computeValue(rods);
  const rodLabels = rods.map((_, idx) => {
    const power = rods.length - 1 - idx;
    if (power === 0) return 'Ones';
    if (power === 1) return 'Tens';
    if (power === 2) return 'Hundreds';
    return `${Math.pow(10, power)}`;
  });

  return (
    <div className="flex flex-col items-center select-none">
      {/* Value Display */}
      <div className="mb-4 bg-white rounded-2xl px-6 py-3 shadow-md border border-blue-100 min-w-[120px] text-center">
        <span className="text-text-light text-sm font-nunito">Value</span>
        <motion.div
          key={currentValue}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="font-fredoka text-4xl text-text-dark"
        >
          {currentValue}
        </motion.div>
      </div>

      {/* Abacus Frame */}
      <div 
        className="relative bg-amber-100 rounded-2xl p-4 shadow-xl border-4 border-amber-900/20 transition-opacity duration-500"
        style={{ opacity }}
      >
        {/* Rods Container */}
        <div className="flex gap-3 sm:gap-4">
          {rods.map((rod, rodIdx) => (
            <div key={rodIdx} className="flex flex-col items-center">
              {/* Rod Column */}
              <div
                className={`relative w-12 sm:w-14 bg-amber-50/50 rounded-lg overflow-hidden border-2 transition-colors ${
                  highlightRod === rodIdx ? 'border-accent-yellow shadow-yellow-200' : 'border-amber-200/50'
                }`}
                style={{ height: '240px' }}
              >
                {/* Heaven bead area */}
                <div className="absolute top-0 left-0 right-0 h-[72px] border-b-2 border-amber-900/40 bg-amber-900/5">
                  {/* Heaven bead slot */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full cursor-pointer bead-snap shadow-md"
                    style={{
                      backgroundColor: '#4ECDC4',
                      top: rod.heaven ? '28px' : '4px',
                      border: '2px solid #3BA99E',
                    }}
                    onClick={() => toggleHeaven(rodIdx)}
                    role="button"
                    aria-label={`Heaven bead for ${rodLabels[rodIdx]}: ${rod.heaven ? 'active' : 'inactive'}`}
                  />
                </div>

                {/* Earth beads area */}
                <div className="absolute bottom-0 left-0 right-0 h-[164px] flex flex-col-reverse items-center justify-start pt-3 gap-1">
                  {[0, 1, 2, 3].map(beadIdx => {
                    const isActive = rod.earth > beadIdx;
                    return (
                      <div
                        key={beadIdx}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full cursor-pointer bead-snap shadow-md"
                        style={{
                          backgroundColor: isActive ? '#FF8C42' : '#FFD8BF',
                          border: `2px solid ${isActive ? '#E07A35' : '#FFC4A0'}`,
                          opacity: interactive || isActive ? 1 : 0.6,
                        }}
                        onClick={() => toggleEarth(rodIdx, beadIdx)}
                        role="button"
                        aria-label={`Earth bead ${beadIdx + 1} for ${rodLabels[rodIdx]}: ${isActive ? 'active' : 'inactive'}`}
                      />
                    );
                  })}
                </div>

                {/* Center beam line */}
                <div className="absolute top-[72px] left-0 right-0 h-1 bg-amber-900/60 pointer-events-none z-10" />
              </div>

              {/* Rod Label */}
              {showLabels && (
                <span className="mt-2 text-xs font-bold text-amber-800/70 uppercase tracking-wider">
                  {rodLabels[rodIdx]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Controls (for accessibility / mouse users) */}
      {interactive && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              const cleared = rods.map(() => ({ heaven: false, earth: 0 }));
              setRods(cleared);
              onChange?.(0);
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-text-medium transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
