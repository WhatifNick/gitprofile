/**
 * Hobby icons come from src/assets/interest-icons/*.svg.
 * In gitprofile.config.ts set `hobbies[].icon` to the file name without
 * `.svg` (e.g. 'drag-race'). Drop a new SVG in that folder to add one.
 */
const files = import.meta.glob<string>('../../assets/interest-icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const HOBBY_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()!
      .replace(/\.svg$/, ''),
    url,
  ]),
);

export const getHobbyIconUrl = (key?: string): string | undefined =>
  key ? HOBBY_ICONS[key] : undefined;
