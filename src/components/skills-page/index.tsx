import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { MdOpenInNew } from 'react-icons/md';
import '../../assets/index.css';
import { Skill, SkillLevel } from '../../interfaces/sanitized-config';
import { getInitialTheme, getSanitizedConfig } from '../../utils';
import {
  formatGroupName,
  SKILL_LEVEL_ORDER,
  SKILL_LEVELS,
  skillSlug,
} from '../../utils/skills';
import SkillLevelMeter from '../skill-level';
import { PAGE_FADES_IN, pageFadeClass } from '../../utils/page-fade';
import { useRevealOnScroll } from '../../hooks/use-reveal-on-scroll';
import Footer from '../footer';

type Filter = SkillLevel | 'all';

const groupId = (group: string) => `group-${skillSlug(group)}`;

/**
 * On a first visit the page fades in over ~1s (.fade-in); meter fills wait
 * until then. Coming from the homepage there's no fade, so no wait.
 */
const PAGE_FADE_MS = PAGE_FADES_IN ? 800 : 0;

/** One category card; its meters fill in when it scrolls into view. */
const SkillGroupSection = ({
  group,
  list,
  pageShownAt,
}: {
  group: string;
  list: Skill[];
  /** performance.now() when the page mounted. */
  pageShownAt: number;
}) => {
  const [ref, revealed] = useRevealOnScroll<HTMLElement>();
  // Cards visible on load start filling once the page fade-in is done.
  const [startDelay, setStartDelay] = useState(0);
  useLayoutEffect(() => {
    if (revealed) {
      setStartDelay(
        Math.max(0, PAGE_FADE_MS - (performance.now() - pageShownAt)),
      );
    }
  }, [revealed, pageShownAt]);
  return (
    <section
      ref={ref}
      id={groupId(group)}
      aria-labelledby={`${groupId(group)}-heading`}
      className={`card scroll-mt-10 bg-base-100 shadow-lg ${
        revealed ? 'skill-reveal-done' : 'skill-reveal-pending'
      }`}
      style={{ '--reveal-base': `${startDelay}ms` } as React.CSSProperties}
    >
      <div className="card-body px-4 py-5 md:px-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id={`${groupId(group)}-heading`}
            className="card-title text-base-content"
          >
            {formatGroupName(group)}
          </h2>
          <span className="text-xs text-base-content/50">
            {list.length} skill{list.length === 1 ? '' : 's'}
          </span>
        </div>
        <ul className="mt-2 grid gap-x-6 gap-y-1 xl:grid-cols-2">
          {list.map((skill, index) => (
            <li
              key={skill.title}
              id={skillSlug(skill.title)}
              className="skill-row -mx-3 rounded-2xl px-3 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base-content">{skill.title}</h3>
                  {skill.url && (
                    <a
                      href={skill.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-primary"
                      aria-label={`${skill.title} website (opens in a new tab)`}
                      title={`Visit ${skill.title}`}
                    >
                      <MdOpenInNew className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <SkillLevelMeter
                  level={skill.level}
                  className="flex-row-reverse"
                  index={index}
                />
              </div>
              {skill.description && (
                <p className="mt-1 text-sm leading-relaxed text-base-content/70">
                  {skill.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/** /skills: every skill with its level and description. */
const SkillsPage = ({ config }: { config: Config }) => {
  const sanitized = useMemo(() => getSanitizedConfig(config), [config]);
  const [filter, setFilter] = useState<Filter>('all');
  const [pageShownAt] = useState(() => performance.now());

  const skills: Record<string, Skill[]> = useMemo(
    () => sanitized.skills ?? {},
    [sanitized],
  );
  const allSkills = useMemo(() => Object.values(skills).flat(), [skills]);
  const homeHref = import.meta.env.BASE_URL;
  const name = sanitized.profile?.name;

  useEffect(() => {
    if (sanitized.themeConfig) {
      document.documentElement.setAttribute(
        'data-theme',
        getInitialTheme(sanitized.themeConfig),
      );
    }
    document.title = name ? `Skills | ${name}` : 'Skills';
  }, [sanitized, name]);

  // The page renders after load, so the browser can't jump to #skill itself.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    // Re-applying the hash scrolls to the row and lets :target highlight it.
    if (id) window.location.replace(`#${id}`);
  }, []);

  // A link to a skill the current filter hides: clear the filter, then jump.
  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (!id || document.getElementById(id)) return;
      setFilter('all');
      requestAnimationFrame(() => window.location.replace(`#${id}`));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const groups = Object.entries(skills)
    .map(
      ([group, list]) =>
        [
          group,
          filter === 'all' ? list : list.filter((s) => s.level === filter),
        ] as const,
    )
    .filter(([, list]) => list.length > 0);

  const countFor = (level: SkillLevel) =>
    allSkills.filter((s) => s.level === level).length;

  const filterButton = (active: boolean) =>
    `flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left sm:px-4 transition-colors ${
      active
        ? 'bg-primary/10 ring-2 ring-primary'
        : 'bg-base-200/60 hover:bg-base-200'
    }`;

  return (
    <div className={`${pageFadeClass} h-screen`}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <main id="main" className="min-h-full bg-base-300 p-4 lg:p-10">
        <a
          href={homeHref}
          className="btn btn-ghost btn-sm mb-4 gap-1 rounded-full px-3"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.61l4.17 4.17a.75.75 0 1 1-1.06 1.06l-5.5-5.5a.75.75 0 0 1 0-1.06l5.5-5.5a.75.75 0 1 1 1.06 1.06L5.61 9.25h10.64A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </a>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sidebar: intro, level key (doubles as the filter), jump links */}
          <aside className="col-span-1">
            <div className="grid gap-6 lg:sticky lg:top-10 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
              <div className="card card-sm bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="mx-3">
                    <h1 className="text-3xl font-bold text-base-content">
                      Skills
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                      The tools I work with and how confident I am with each.
                      Levels are my own honest self-assessment.
                    </p>
                  </div>

                  <div
                    className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1"
                    role="group"
                    aria-label="Filter skills by level"
                  >
                    <button
                      type="button"
                      aria-pressed={filter === 'all'}
                      onClick={() => setFilter('all')}
                      className={`${filterButton(filter === 'all')} col-span-2 lg:col-span-1`}
                    >
                      <span className="font-semibold text-base-content">
                        All skills
                      </span>
                      <span className="badge badge-ghost badge-sm ml-auto">
                        {allSkills.length}
                      </span>
                    </button>
                    {SKILL_LEVEL_ORDER.map((level) => {
                      const active = filter === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setFilter(active ? 'all' : level)}
                          className={`${filterButton(active)} items-start text-center`}
                        >
                          <span className="min-w-0 flex-1">
                            <SkillLevelMeter level={level} />
                            <span className="mt-1 text-xs leading-snug text-base-content/60 block">
                              {SKILL_LEVELS[level].summary}
                            </span>
                          </span>
                          <span className="badge badge-ghost badge-sm hidden sm:inline-flex">
                            {countFor(level)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <nav
                    aria-label="Skill categories"
                    className="mt-4 hidden border-t border-base-content/10 pt-4 lg:block"
                  >
                    <h2 className="mx-3 text-sm font-semibold text-base-content/60">
                      Jump to
                    </h2>
                    <ul className="menu menu-sm mt-1 w-full p-0">
                      {groups.map(([group, list]) => (
                        <li key={group}>
                          <a
                            href={`#${groupId(group)}`}
                            className="flex justify-between rounded-full"
                          >
                            {formatGroupName(group)}
                            <span className="text-xs text-base-content/50">
                              {list.length}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </aside>

          {/* Skill groups */}
          <div className="col-span-1 grid content-start gap-6 lg:col-span-2">
            {groups.map(([group, list]) => (
              <SkillGroupSection
                key={group}
                group={group}
                list={list}
                pageShownAt={pageShownAt}
              />
            ))}
          </div>
        </div>
      </main>
      <footer style={{ marginBottom: '-200px' }}>
        <Footer />
      </footer>
    </div>
  );
};

export default SkillsPage;
