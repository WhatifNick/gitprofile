import {
  Fragment,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { IconType } from 'react-icons';
import { IoMdLink } from 'react-icons/io';
import {
  MdArrowBack,
  MdFileDownload,
  MdLanguage,
  MdLocationOn,
  MdOutlineEmail,
  MdPhoneIphone,
} from 'react-icons/md';
import '@fontsource/mulish/300.css';
import '@fontsource/mulish/400.css';
import '@fontsource/mulish/500.css';
import '@fontsource/mulish/600.css';
import '@fontsource/mulish/700.css';
import '@fontsource/mulish/800.css';
import '../../assets/index.css';
import './resume.css';
import { getSanitizedConfig } from '../../utils';
import {
  PdfVisibility,
  Project,
  SanitizedConfig,
  SanitizedExperience,
} from '../../interfaces/sanitized-config';
import { getHobbyIconUrl } from '../hobbies-card/icons';

/** "November 2024" -> "Nov 2024" (leaves "Present" etc. untouched). */
const shortMonth = (date: string) =>
  date.replace(
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\b/,
    (month) => month.slice(0, 3),
  );

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const prettyUrl = (url: string) => url.replace(/\/$/, '');

const withProtocol = (url: string) =>
  url.startsWith('http') ? url : `https://${url}`;

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="r-heading">{children}</h2>
);

const ContactItem = ({
  icon: Icon,
  children,
  href,
}: {
  icon: IconType;
  children: React.ReactNode;
  href?: string;
}) => (
  <li>
    {href ? <a href={href}>{children}</a> : <span>{children}</span>}
    <Icon aria-hidden="true" focusable="false" />
  </li>
);

const ProjectItem = ({
  project,
  showLink,
}: {
  project: Project;
  showLink?: boolean;
}) => (
  <>
    <h3 className="r-item-title">{project.title}</h3>
    {project.company && <p className="r-item-sub">{project.company}</p>}
    {project.description && <p className="r-text">{project.description}</p>}
    {!!project.skills?.length && (
      <p className="r-text r-built">Built using: {project.skills.join(', ')}</p>
    )}
    {showLink && project.link && (
      <a className="r-pill" href={project.link}>
        <IoMdLink aria-hidden="true" focusable="false" />
        {prettyUrl(project.link)}
      </a>
    )}
  </>
);

const ExperienceItem = ({
  experience,
}: {
  experience: SanitizedExperience;
}) => (
  <>
    <h3 className="r-item-title">{experience.company}</h3>
    {experience.position && <p className="r-item-sub">{experience.position}</p>}
    <p className="r-date">
      From {shortMonth(experience.from)} to {shortMonth(experience.to)}
    </p>
  </>
);

/** Drops items marked `hideOnPDF: true` in gitprofile.config.ts. */
const onPdf = <T extends PdfVisibility>(items: T[]): T[] =>
  items.filter((item) => !item.hideOnPDF);

/** Applies `hideOnPDF` to every list the resume prints. */
const pdfContent = (config: SanitizedConfig): SanitizedConfig => ({
  ...config,
  featuredProjects: onPdf(config.featuredProjects),
  professionalProjects: onPdf(config.professionalProjects),
  experiences: onPdf(config.experiences),
  educations: onPdf(config.educations),
  certifications: onPdf(config.certifications),
  community: onPdf(config.community),
  publications: onPdf(config.publications),
  hobbies: onPdf(config.hobbies),
  skills: Object.fromEntries(
    Object.entries(config.skills)
      .map(([group, skills]) => [group, onPdf(skills)] as const)
      .filter(([, skills]) => skills.length > 0),
  ),
});

const skillHeading = (key: string) =>
  key.charAt(0).toUpperCase() + key.slice(1);

/* ------------------------------------------------------------------ */
/* Page flow                                                           */
/* ------------------------------------------------------------------ */

/** Height of the printable area of an A4 page (297mm minus 10mm margins). */
const PAGE_CONTENT_MM = 277;
const MM_TO_PX = 96 / 25.4;

/**
 * A section whose items can flow between columns and pages. Items that don't
 * fit at the bottom of a column continue at the top of the next column.
 */
interface FlowSection {
  key: string;
  title: string;
  list: 'ol' | 'ul';
  items: ReactNode[];
  /** Render items without the timeline (used for the hobbies grid). */
  plain?: boolean;
}

/** The four columns content can sit in. */
type Column = 'p1-left' | 'p1-right' | 'p2-left' | 'p2-right';

/** Number of items that fit in each column that can overflow. */
interface Cuts {
  p1Left: number;
  p1Right: number;
  /** null = page 2 not measured yet. */
  p2Left: number | null;
}

const NO_SPLIT: Cuts = {
  p1Left: Infinity,
  p1Right: Infinity,
  p2Left: Infinity,
};

/** Spacing scale steps tried (largest first) to fit everything on 2 pages. */
const SPACING_STEPS = [1, 0.9, 0.8, 0.7, 0.6, 0.5];

/**
 * Pages are only laid out as fixed A4 sheets when printing and on wide
 * screens; on phones the resume is one continuous column.
 */
const usesPages = () =>
  window.matchMedia('print').matches ||
  window.matchMedia('(min-width: 840px)').matches;

/** Splits sections after `cut` items: [before the cut, after the cut]. */
const splitSections = (
  sections: FlowSection[],
  cut: number,
): [FlowSection[], FlowSection[]] => {
  const first: FlowSection[] = [];
  const rest: FlowSection[] = [];
  let seen = 0;
  for (const section of sections) {
    const keep = Math.max(0, Math.min(section.items.length, cut - seen));
    if (keep > 0) {
      first.push({ ...section, items: section.items.slice(0, keep) });
    }
    if (keep < section.items.length) {
      rest.push({
        ...section,
        key: `${section.key}-rest`,
        // A section split across columns just carries on (no repeated
        // heading); the heading only moves if the whole section does.
        title: keep === 0 ? section.title : '',
        items: section.items.slice(keep),
      });
    }
    seen += section.items.length;
  }
  return [first, rest];
};

const FlowSectionView = ({
  section,
  column,
}: {
  section: FlowSection;
  column: Column;
}) => {
  const List = section.list;
  const label = section.key.replace(/-rest$/, '');
  return (
    <section
      className="r-section"
      // Keeps a continued part labelled for screen readers.
      aria-label={section.title ? undefined : label}
    >
      {section.title && <Heading>{section.title}</Heading>}
      {section.plain ? (
        section.items.map((item, index) => (
          <div key={index} data-flow-item={column}>
            {item}
          </div>
        ))
      ) : (
        <List className="r-timeline">
          {section.items.map((item, index) => (
            <li className="r-item" key={index} data-flow-item={column}>
              {item}
            </li>
          ))}
        </List>
      )}
    </section>
  );
};

/**
 * Printable resume built entirely from gitprofile.config.ts.
 * Rendered at /resume and turned into /resume.pdf at build time.
 */
const Resume = ({ config }: { config: Config }) => {
  const sanitized = pdfContent(getSanitizedConfig(config) as SanitizedConfig);
  const { profile, resume, social } = sanitized;
  const isPrintRun = new URLSearchParams(window.location.search).has('print');
  // The private PDF run injects the phone number at render time (see
  // scripts/generate-resume-pdf.mjs), so it never ships in the site's code.
  const phone =
    (window as Window & { __RESUME_PRIVATE__?: { phone?: string } })
      .__RESUME_PRIVATE__?.phone || social.phone;

  const page1Ref = useRef<HTMLDivElement | null>(null);
  const page2Ref = useRef<HTMLDivElement | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [cuts, setCuts] = useState<Cuts | null>(null);
  const [spacingStep, setSpacingStep] = useState(0);
  const [settled, setSettled] = useState(false);

  /** Start the layout over (new window size, or new spacing). */
  const relayout = (step = 0) => {
    setSettled(false);
    setSpacingStep(step);
    setCuts(null);
  };

  useEffect(() => {
    document.title = `${profile.name} – Resume`;
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('resume-root');
    document.fonts.ready.then(() => setFontsReady(true));

    // Re-flow the pages when the window size changes (e.g. phone rotated).
    let timer: number | undefined;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => relayout(), 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      document.documentElement.classList.remove('resume-root');
    };
  }, [profile.name]);

  // Layout runs in steps, each measured before the browser paints:
  //  1. Everything on page 1: find what overflows each page-1 column.
  //  2. Overflow + the rest in page 2's left column: find where it overflows.
  //  3. If page 2's right column still overflows, tighten the spacing a
  //     notch and start again, so everything fits on two pages.
  useLayoutEffect(() => {
    if (!fontsReady || settled) return;
    if (!usesPages()) {
      setCuts(NO_SPLIT);
      setSettled(true);
      return;
    }
    const pageLimit = (page: HTMLElement) =>
      page.getBoundingClientRect().top +
      parseFloat(getComputedStyle(page).paddingTop) +
      PAGE_CONTENT_MM * MM_TO_PX;
    const firstOverflow = (page: HTMLElement, column: Column) => {
      const limit = pageLimit(page);
      const items = Array.from(
        page.querySelectorAll<HTMLElement>(`[data-flow-item="${column}"]`),
      );
      const index = items.findIndex(
        (item) => item.getBoundingClientRect().bottom > limit + 0.5,
      );
      return index === -1 ? Infinity : index;
    };
    const page1 = page1Ref.current;
    const page2 = page2Ref.current;
    if (!page1 || !page2) return;

    if (cuts === null) {
      setCuts({
        p1Left: firstOverflow(page1, 'p1-left'),
        p1Right: firstOverflow(page1, 'p1-right'),
        p2Left: null,
      });
    } else if (cuts.p2Left === null) {
      setCuts({ ...cuts, p2Left: firstOverflow(page2, 'p2-left') });
    } else {
      const overflows = firstOverflow(page2, 'p2-right') !== Infinity;
      if (overflows && spacingStep < SPACING_STEPS.length - 1) {
        relayout(spacingStep + 1);
      } else {
        setSettled(true);
      }
    }
  }, [fontsReady, settled, cuts, spacingStep]);

  // Lets the PDF script know fonts and page flow are settled.
  useEffect(() => {
    if (settled) document.documentElement.dataset.resumeReady = 'true';
  }, [settled]);

  const leftSections: FlowSection[] = [
    {
      key: 'Highlighted Projects',
      title: 'Highlighted Projects',
      list: 'ol' as const,
      items: sanitized.featuredProjects.map((project, index) => (
        <ProjectItem key={index} project={project} showLink />
      )),
    },
    {
      key: 'Experience',
      title: 'Experience',
      list: 'ol' as const,
      items: sanitized.experiences.map((experience, index) => (
        <ExperienceItem key={index} experience={experience} />
      )),
    },
  ].filter((section) => section.items.length > 0);

  const rightSections: FlowSection[] = [
    {
      key: 'Professional Skills',
      title: 'Professional Skills',
      list: 'ul' as const,
      items: Object.entries(sanitized.skills).map(([group, skills]) => (
        <Fragment key={group}>
          <h3 className="r-item-title">{skillHeading(group)}</h3>
          <ul className="r-skill-grid">
            {skills.map((skill) => (
              <li key={skill.title}>{skill.title}</li>
            ))}
          </ul>
        </Fragment>
      )),
    },
    {
      key: 'Professional Projects',
      title: 'Professional Projects',
      list: 'ol' as const,
      items: sanitized.professionalProjects.map((project, index) => (
        <ProjectItem key={index} project={project} />
      )),
    },
  ].filter((section) => section.items.length > 0);

  const page2OnlySections: FlowSection[] = [
    {
      key: 'Education',
      title: 'Education',
      list: 'ol' as const,
      items: sanitized.educations.map((item, index) => (
        <Fragment key={index}>
          <p className="r-item-sub">
            From {item.from} to {item.to}
          </p>
          <h3 className="r-item-title r-item-title-lg">{item.degree}</h3>
          <p className="r-text">
            {item.institution}
            {item.location && (
              <>
                <br />
                {item.location}
              </>
            )}
          </p>
        </Fragment>
      )),
    },
    {
      key: 'Community',
      title: 'Community',
      list: 'ol' as const,
      items: sanitized.community.map((item, index) => (
        <Fragment key={index}>
          <h3 className="r-item-title r-item-title-lg">{item.name}</h3>
          {item.body && <p className="r-item-sub">{item.body}</p>}
          {item.description && <p className="r-text">{item.description}</p>}
        </Fragment>
      )),
    },
    {
      key: 'Hobbies & Interests',
      title: 'Hobbies & Interests',
      list: 'ul' as const,
      plain: true,
      items:
        sanitized.hobbies.length > 0
          ? [
              <ul className="r-hobbies" key="hobbies">
                {sanitized.hobbies.map((hobby) => {
                  const iconUrl = getHobbyIconUrl(hobby.icon);
                  return (
                    <li key={hobby.title}>
                      {iconUrl ? (
                        <img className="r-hobby-icon" src={iconUrl} alt="" />
                      ) : (
                        <span className="r-hobby-icon r-hobby-icon-empty" />
                      )}
                      {hobby.title}
                    </li>
                  );
                })}
              </ul>,
            ]
          : [],
    },
  ].filter((section) => section.items.length > 0);

  const activeCuts = cuts ?? { ...NO_SPLIT, p2Left: null };
  const [p1Left, leftOverflow] = splitSections(leftSections, activeCuts.p1Left);
  const [p1Right, rightOverflow] = splitSections(
    rightSections,
    activeCuts.p1Right,
  );
  // Page 2 reads on from page 1: left-column overflow, right-column overflow,
  // then the sections that always live on page 2.
  const page2Sections = [
    ...leftOverflow,
    ...rightOverflow,
    ...page2OnlySections,
  ];
  const [p2Left, p2Right] = splitSections(
    page2Sections,
    activeCuts.p2Left ?? Infinity,
  );

  return (
    <div
      className="r-screen"
      style={{ '--r-space': SPACING_STEPS[spacingStep] } as React.CSSProperties}
    >
      {!isPrintRun && (
        <nav className="r-toolbar" aria-label="Resume actions">
          <a href={import.meta.env.BASE_URL} className="r-btn r-btn-ghost">
            <MdArrowBack aria-hidden="true" focusable="false" />
            Back to portfolio
          </a>
          {resume.fileUrl && (
            <a
              href={resume.fileUrl}
              download={resume.fileName || true}
              className="r-btn"
            >
              <MdFileDownload aria-hidden="true" focusable="false" />
              Download PDF
            </a>
          )}
        </nav>
      )}

      <main className="resume" id="main">
        {/* ---------- Page 1 ---------- */}
        <div className="r-page r-page-1" ref={page1Ref}>
          <header className="r-header">
            <div className="r-identity">
              <div className="r-monogram" aria-hidden="true">
                {initials(profile.name)}
              </div>
              <div>
                <h1 className="r-name">{profile.name}</h1>
                {profile.title && <p className="r-title">{profile.title}</p>}
              </div>
            </div>
            <ul className="r-contact" aria-label="Contact details">
              {(resume.location || profile.location) && (
                <ContactItem icon={MdLocationOn}>
                  {resume.location || profile.location}
                </ContactItem>
              )}
              {social.email && (
                <ContactItem
                  icon={MdOutlineEmail}
                  href={`mailto:${social.email}`}
                >
                  {social.email}
                </ContactItem>
              )}
              {resume.website && (
                <ContactItem
                  icon={MdLanguage}
                  href={withProtocol(resume.website)}
                >
                  {resume.website}
                </ContactItem>
              )}
              {phone && (
                <ContactItem
                  icon={MdPhoneIphone}
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                >
                  {phone}
                </ContactItem>
              )}
            </ul>
          </header>

          {profile.summary.length > 0 && (
            <section className="r-summary" aria-label="About me">
              {profile.summary.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          )}

          <div className="r-cols">
            <div>
              {p1Left.map((section) => (
                <FlowSectionView
                  key={section.key}
                  section={section}
                  column="p1-left"
                />
              ))}
            </div>
            <div>
              {p1Right.map((section) => (
                <FlowSectionView
                  key={section.key}
                  section={section}
                  column="p1-right"
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Page 2 ---------- */}
        <div className="r-page r-page-2" ref={page2Ref}>
          <div className="r-cols">
            <div>
              {p2Left.map((section) => (
                <FlowSectionView
                  key={section.key}
                  section={section}
                  column="p2-left"
                />
              ))}
            </div>
            <div>
              {p2Right.map((section) => (
                <FlowSectionView
                  key={section.key}
                  section={section}
                  column="p2-right"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resume;
