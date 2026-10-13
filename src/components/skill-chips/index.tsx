import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { Skill } from '../../interfaces/sanitized-config';
import { MAX_SKILL_RANK, SKILL_LEVELS, skillHref } from '../../utils/skills';
import SkillLevelMeter from '../skill-level';
import { useCanHover } from '../../hooks/use-can-hover';
import { useRevealOnScroll } from '../../hooks/use-reveal-on-scroll';

const POPOVER_ID = 'skill-popover';
/**
 * Which mobile panel is open, shared by every chip list on the page so
 * opening one closes the others. Value is `${listId}:${chipIndex}`.
 */
let openPanel: string | null = null;
const panelListeners = new Set<() => void>();
const setOpenPanel = (key: string | null) => {
  openPanel = key;
  panelListeners.forEach((listener) => listener());
};
const subscribePanel = (listener: () => void) => {
  panelListeners.add(listener);
  return () => {
    panelListeners.delete(listener);
  };
};
const useOpenPanel = () =>
  useSyncExternalStore(
    subscribePanel,
    () => openPanel,
    () => null,
  );

/** Shared body of the desktop popover and the mobile panel. */
const SkillDetails = ({ skill }: { skill: Skill }) => (
  <>
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
      <p className="font-bold text-base-content">{skill.title}</p>
      <SkillLevelMeter level={skill.level} />
    </div>
    {skill.description && (
      <p className="mt-2 text-sm leading-relaxed text-base-content/80">
        {skill.description}
      </p>
    )}
  </>
);

type Placement = { top: number; left: number; arrow: number; below: boolean };

/** Desktop: floating card above (or below) the hovered/focused chip. */
const SkillPopover = ({
  anchor,
  skill,
  onPointerEnter,
  onPointerLeave,
}: {
  anchor: HTMLElement;
  skill: Skill;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const gap = 10;
    const margin = 8;
    const a = anchor.getBoundingClientRect();
    const p = el.getBoundingClientRect();
    let top = a.top - p.height - gap;
    const below = top < margin;
    if (below) top = a.bottom + gap;
    const center = a.left + a.width / 2;
    const left = Math.min(
      Math.max(center - p.width / 2, margin),
      window.innerWidth - p.width - margin,
    );
    setPlacement({ top, left, arrow: center - left, below });
  }, [anchor, skill]);

  return createPortal(
    <div
      ref={ref}
      id={POPOVER_ID}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      style={{
        top: placement?.top ?? 0,
        left: placement?.left ?? 0,
        visibility: placement ? 'visible' : 'hidden',
      }}
      className="skill-popover fixed z-50 w-80 max-w-[calc(100vw-1rem)] rounded-2xl bg-base-100 p-4 text-left shadow-xl ring-1 ring-base-content/10"
    >
      {placement && (
        <span
          aria-hidden="true"
          className={`absolute h-3 w-3 rotate-45 bg-base-100 ${
            placement.below ? '-top-1.5' : '-bottom-1.5'
          }`}
          style={{ left: placement.arrow - 6 }}
        />
      )}
      <SkillDetails skill={skill} />
      <a
        href={skillHref(skill.title)}
        className="link link-primary mt-3 inline-block text-xs font-semibold no-underline"
        tabIndex={-1}
      >
        See on skills page →
      </a>
    </div>,
    document.body,
  );
};

/** Mobile: full-width panel that opens under the row of the tapped chip. */
const SkillPanel = ({
  id,
  skill,
  arrow,
  intro,
  takeScroll,
  onClose,
  closing = false,
  onClosed,
}: {
  id: string;
  skill: Skill;
  arrow: number;
  /**
   * Play the open animation. False when the panel is only being re-placed
   * after the rows reflowed (e.g. phone rotated).
   */
  intro: boolean;
  /**
   * Returns true once per tap-to-open, so the panel scrolls into view when
   * opened but never pulls the page back to it afterwards.
   */
  takeScroll: () => boolean;
  onClose: () => void;
  /** Play the collapse animation, then call onClosed so it can unmount. */
  closing?: boolean;
  onClosed?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!takeScroll()) return;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    ref.current?.scrollIntoView({
      block: 'nearest',
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [skill, takeScroll]);

  return (
    <div
      ref={ref}
      id={closing ? undefined : id}
      role={closing ? undefined : 'region'}
      aria-label={closing ? undefined : `${skill.title} details`}
      aria-hidden={closing || undefined}
      inert={closing || undefined}
      className={`skill-panel relative basis-full ${
        closing ? 'skill-panel-closing' : intro ? 'skill-panel-intro' : ''
      }`}
      onAnimationEnd={(e) => {
        if (closing && e.target === e.currentTarget) onClosed?.();
      }}
    >
      <div className="skill-panel-body">
        <div className="rounded-2xl bg-base-200 p-4 shadow-inner">
          <SkillDetails skill={skill} />
          <div className="mt-4 flex items-center justify-between gap-2">
            <a
              href={skillHref(skill.title)}
              className="link link-primary text-sm font-semibold no-underline"
            >
              See on skills page →
            </a>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="absolute -top-1.5 h-3 w-3 rotate-45 bg-base-200"
        style={{ left: arrow - 6 }}
      />
    </div>
  );
};

/** Inside of a 'rich' chip: name plus a mini level meter. */
const RichChipContent = ({
  label,
  skill,
}: {
  label: string;
  skill?: Skill;
}) => {
  const level = skill?.level ? SKILL_LEVELS[skill.level] : undefined;
  return (
    <>
      <span>{label}</span>
      {level && (
        <>
          <span className="skill-chip-meter" aria-hidden="true">
            {Array.from({ length: MAX_SKILL_RANK }, (_, i) => (
              <span
                key={i}
                className="skill-chip-seg"
                style={{ '--s': i } as React.CSSProperties}
              >
                {i < level.rank && <span className="skill-chip-seg-fill" />}
              </span>
            ))}
          </span>
          <span className="sr-only">, {level.label}</span>
        </>
      )}
    </>
  );
};

export interface ChipItem {
  label: string;
  /** Matching skill from the config; without one the chip is plain text. */
  skill?: Skill;
}

/**
 * A wrapping row of skill chips. On desktop, hovering or focusing a chip
 * shows a popover and clicking opens /skills at that skill. On touch
 * screens, tapping a chip opens a panel under that chip's row.
 */
const SkillChipList = ({
  items,
  leading,
  className = '',
  variant = 'badge',
}: {
  items: ChipItem[];
  /** Rendered before the chips, e.g. a project's link chip. */
  leading?: ReactNode;
  className?: string;
  /**
   * 'badge': compact daisyUI badges (project cards).
   * 'rich': larger chips with a level meter that animate in on scroll.
   */
  variant?: 'badge' | 'rich';
}) => {
  const listId = useId();
  const rich = variant === 'rich';

  // Rich chips' meters fill in once the list scrolls into view.
  const [containerRef, revealed] = useRevealOnScroll<HTMLDivElement>(rich);
  const canHover = useCanHover();
  const open = useOpenPanel();
  const openIndex =
    open && open.startsWith(`${listId}:`)
      ? Number(open.slice(listId.length + 1))
      : -1;

  const chipRefs = useRef<(HTMLElement | null)[]>([]);
  const [layout, setLayout] = useState<{ after: number; arrow: number } | null>(
    null,
  );
  const [measureTick, setMeasureTick] = useState(0);

  const [hovered, setHovered] = useState<{
    skill: Skill;
    el: HTMLElement;
    index: number;
  } | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoveredRef = useRef(hovered);
  hoveredRef.current = hovered;

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

  const showPopover = useCallback(
    (skill: Skill, el: HTMLElement, index: number, immediate = false) => {
      clearTimers();
      // Already showing one: switch instantly as the pointer moves along.
      if (immediate || hoveredRef.current) {
        setHovered({ skill, el, index });
      } else {
        openTimer.current = window.setTimeout(
          () => setHovered({ skill, el, index }),
          150,
        );
      }
    },
    [],
  );

  const hidePopover = useCallback(() => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setHovered(null), 120);
  }, []);

  useEffect(() => clearTimers, []);

  // Reset when switching between mouse and touch layouts.
  useEffect(() => {
    clearTimers();
    setHovered(null);
    if (openPanel?.startsWith(`${listId}:`)) setOpenPanel(null);
  }, [canHover, listId]);

  // Esc closes either; scrolling closes the floating popover.
  useEffect(() => {
    if (!hovered && openIndex < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setHovered(null);
      if (openIndex >= 0) setOpenPanel(null);
    };
    const onScroll = () => setHovered(null);
    document.addEventListener('keydown', onKey);
    if (hovered) window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, [hovered, openIndex]);

  // Find the last chip on the same row as the open one, so the panel can be
  // slotted in right after it. Measured with the panel removed (layout null).
  useLayoutEffect(() => {
    if (openIndex < 0) {
      setLayout(null);
      return;
    }
    if (layout) return;
    const chip = chipRefs.current[openIndex];
    const container = containerRef.current;
    if (!chip || !container) return;
    const top = chip.offsetTop;
    let after = openIndex;
    for (let i = openIndex + 1; i < items.length; i++) {
      if (chipRefs.current[i]?.offsetTop !== top) break;
      after = i;
    }
    const chipRect = chip.getBoundingClientRect();
    const boxRect = container.getBoundingClientRect();
    setLayout({
      after,
      arrow: chipRect.left + chipRect.width / 2 - boxRect.left,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, measureTick, items.length]);

  // Switching chips: re-measure from scratch.
  const [reflowed, setReflowed] = useState(false);

  // The panel that was last on screen, so it can animate shut after the
  // open skill changes or closes.
  type PanelSnapshot = { skill: Skill; after: number; arrow: number };
  const shownPanel = useRef<PanelSnapshot | null>(null);
  const [closingPanel, setClosingPanel] = useState<PanelSnapshot | null>(null);
  const clearClosing = useCallback(() => setClosingPanel(null), []);
  const scrollPending = useRef(false);
  const takeScroll = useCallback(() => {
    const pending = scrollPending.current;
    scrollPending.current = false;
    return pending;
  }, []);

  useLayoutEffect(() => {
    const previous = shownPanel.current;
    shownPanel.current = null;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    setClosingPanel(previous && !reduce ? previous : null);
    setLayout(null);
    setMeasureTick((t) => t + 1);
    setReflowed(false);
    scrollPending.current = openIndex >= 0;
  }, [openIndex]);

  // Fallback in case animationend never fires (e.g. tab in the background).
  useEffect(() => {
    if (!closingPanel) return;
    const timer = window.setTimeout(clearClosing, 400);
    return () => window.clearTimeout(timer);
  }, [closingPanel, clearClosing]);

  // Rows only reflow when the width changes (e.g. rotating the phone).
  // Mobile browsers also fire 'resize' when the address bar shows or hides
  // while scrolling; those height-only changes are ignored so the panel
  // doesn't close, reopen and pull the page back to it.
  useEffect(() => {
    if (openIndex < 0) return;
    let lastWidth = window.innerWidth;
    const remeasure = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      setReflowed(true);
      setLayout(null);
      setMeasureTick((t) => t + 1);
    };
    window.addEventListener('resize', remeasure);
    return () => window.removeEventListener('resize', remeasure);
  }, [openIndex]);

  const panelId = `skill-panel-${listId.replace(/[^a-zA-Z0-9-]/g, '')}`;
  const openSkill = openIndex >= 0 ? items[openIndex]?.skill : undefined;

  useEffect(() => {
    if (openSkill && layout) {
      shownPanel.current = {
        skill: openSkill,
        after: layout.after,
        arrow: layout.arrow,
      };
    }
  }, [openSkill, layout]);

  const closePanel = () => {
    // Hand focus back to the chip so keyboard/screen reader users keep
    // their place when the Close button disappears.
    chipRefs.current[openIndex]?.focus({ preventScroll: true });
    setOpenPanel(null);
  };
  const noScroll = useCallback(() => false, []);

  return (
    <div
      ref={containerRef}
      style={
        { '--chip-gap': rich ? '0.625rem' : '0.5rem' } as React.CSSProperties
      }
      className={`flex flex-wrap justify-start ${rich ? 'gap-2.5' : 'gap-2'} ${
        rich ? (revealed ? 'skill-reveal-done' : 'skill-reveal-pending') : ''
      } ${className}`}
    >
      {leading}
      {items.map((item, index) => {
        const setRef = (el: HTMLElement | null) => {
          chipRefs.current[index] = el;
        };
        const { skill } = item;
        const isOpen = index === openIndex;
        const active = isOpen || hovered?.index === index;
        const chipClass = rich
          ? `skill-chip ${active ? 'skill-chip-active' : ''} ${
              skill?.level === 'expert' ? 'skill-chip-expert' : ''
            }`
          : `badge font-bold text-xs transition-all duration-150 ${
              active ? 'badge-secondary' : 'badge-primary'
            }`;
        const content = rich ? (
          <RichChipContent label={item.label} skill={skill} />
        ) : (
          item.label
        );
        const style = rich
          ? ({ '--i': index } as React.CSSProperties)
          : undefined;

        let chip: ReactNode;
        if (!skill) {
          chip = (
            <span ref={setRef} className={chipClass} style={style}>
              {content}
            </span>
          );
        } else if (canHover) {
          chip = (
            <a
              ref={setRef}
              href={skillHref(skill.title)}
              className={`${chipClass} ${rich ? '' : 'hover:-translate-y-0.5'}`}
              style={style}
              aria-describedby={
                hovered?.index === index ? POPOVER_ID : undefined
              }
              onMouseEnter={(e) => showPopover(skill, e.currentTarget, index)}
              onMouseLeave={hidePopover}
              onFocus={(e) => showPopover(skill, e.currentTarget, index, true)}
              onBlur={hidePopover}
            >
              {content}
            </a>
          );
        } else {
          chip = (
            <button
              ref={setRef}
              type="button"
              className={`${chipClass} cursor-pointer`}
              style={style}
              aria-expanded={isOpen}
              aria-controls={isOpen ? panelId : undefined}
              onClick={() => setOpenPanel(isOpen ? null : `${listId}:${index}`)}
            >
              {content}
            </button>
          );
        }

        return (
          <Fragment key={`${item.label}-${index}`}>
            {chip}
            {!canHover &&
              closingPanel &&
              closingPanel.after === index &&
              !(openSkill && layout && layout.after === index) && (
                <SkillPanel
                  key={`closing-${closingPanel.skill.title}`}
                  id={panelId}
                  skill={closingPanel.skill}
                  arrow={closingPanel.arrow}
                  intro={false}
                  takeScroll={noScroll}
                  onClose={clearClosing}
                  closing
                  onClosed={clearClosing}
                />
              )}
            {!canHover && openSkill && layout && layout.after === index && (
              <SkillPanel
                id={panelId}
                skill={openSkill}
                arrow={layout.arrow}
                intro={!reflowed}
                takeScroll={takeScroll}
                onClose={closePanel}
              />
            )}
          </Fragment>
        );
      })}
      {canHover && hovered && (
        <SkillPopover
          anchor={hovered.el}
          skill={hovered.skill}
          onPointerEnter={clearTimers}
          onPointerLeave={hidePopover}
        />
      )}
    </div>
  );
};

export default SkillChipList;
