import { SkillLevel } from '../../interfaces/sanitized-config';
import { MAX_SKILL_RANK, SKILL_LEVELS } from '../../utils/skills';

/**
 * Four-step meter with the tier name beside it. The bars are decorative; the
 * label is what screen readers announce.
 */
const SkillLevelMeter = ({
  level,
  size = 'sm',
  className = '',
  index,
}: {
  level?: SkillLevel;
  size?: 'sm' | 'md';
  className?: string;
  /**
   * Position in a list. Inside a `skill-reveal-*` container the bars fill in
   * when it scrolls into view, staggered by this index.
   */
  index?: number;
}) => {
  if (!level || !SKILL_LEVELS[level]) return null;
  const { label, rank } = SKILL_LEVELS[level];
  const bar = size === 'md' ? 'h-2 w-6' : 'h-1.5 w-4';

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      style={
        index === undefined
          ? undefined
          : ({ '--i': index } as React.CSSProperties)
      }
    >
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: MAX_SKILL_RANK }, (_, i) => (
          <span
            key={i}
            className={`${bar} relative overflow-hidden rounded-full bg-base-content/20`}
          >
            {i < rank && (
              <span
                className="skill-chip-seg-fill"
                style={{ '--s': i } as React.CSSProperties}
              />
            )}
          </span>
        ))}
      </span>
      <span
        className={`${size === 'md' ? 'text-sm' : 'text-xs'} font-semibold opacity-80`}
      >
        {label}
      </span>
    </span>
  );
};

export default SkillLevelMeter;
