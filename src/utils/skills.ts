import { Skill, SkillLevel } from '../interfaces/sanitized-config';

export interface SkillLevelInfo {
  label: string;
  /** 1 (lowest) to 4 (highest); drives the meter. */
  rank: number;
  summary: string;
}

/** Ordered highest first. Edit the wording here to change it site-wide. */
export const SKILL_LEVELS: Record<SkillLevel, SkillLevelInfo> = {
  expert: {
    label: 'Expert',
    rank: 4,
    summary: 'Yea, I got skills.',
  },
  proficient: {
    label: 'Proficient',
    rank: 3,
    summary: 'Got it down.',
  },
  working: {
    label: 'Working knowledge',
    rank: 2,
    summary: 'The training wheels are off, but I still need some guidance.',
  },
  familiar: {
    label: 'Familiar',
    rank: 1,
    summary: 'I know the idea, but will probably need to look up details.',
  },
};

export const SKILL_LEVEL_ORDER = Object.keys(SKILL_LEVELS) as SkillLevel[];

export const MAX_SKILL_RANK = 4;

export const SKILLS_PAGE_PATH = '/skills';

/** 'CSS/SCSS/SASS' -> 'css-scss-sass', used for #anchors on /skills. */
export const skillSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const skillHref = (title: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}${SKILLS_PAGE_PATH}#${skillSlug(title)}`;

export const formatGroupName = (group: string): string =>
  group.charAt(0).toUpperCase() + group.slice(1);

const normalise = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Builds a finder from a name used in a project's `skills` list to the
 * matching skill. Ignores case and punctuation ('Typescript' -> TypeScript),
 * matches either half of 'React/React Native' style titles, and checks each
 * skill's `aliases`.
 */
export const createSkillLookup = (skills: Record<string, Skill[]>) => {
  const exact = new Map<string, Skill>();
  const loose = new Map<string, Skill>();
  Object.values(skills)
    .flat()
    .forEach((skill) => {
      exact.set(normalise(skill.title), skill);
      [...skill.title.split('/'), ...(skill.aliases ?? [])].forEach((name) => {
        const key = normalise(name);
        if (key && !loose.has(key)) loose.set(key, skill);
      });
    });
  return (name: string): Skill | undefined => {
    const key = normalise(name);
    return exact.get(key) ?? loose.get(key);
  };
};
