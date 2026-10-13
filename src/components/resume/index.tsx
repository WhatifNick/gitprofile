import { useEffect } from 'react';
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
  <li className="r-item">
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
  </li>
);

const ExperienceItem = ({
  experience,
}: {
  experience: SanitizedExperience;
}) => (
  <li className="r-item">
    <h3 className="r-item-title">{experience.company}</h3>
    {experience.position && <p className="r-item-sub">{experience.position}</p>}
    <p className="r-date">
      From {shortMonth(experience.from)} to {shortMonth(experience.to)}
    </p>
  </li>
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

  useEffect(() => {
    document.title = `${profile.name} – Resume`;
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('resume-root');
    // Lets the PDF script know fonts and layout are settled.
    document.fonts.ready.then(() => {
      document.documentElement.dataset.resumeReady = 'true';
    });
    return () => document.documentElement.classList.remove('resume-root');
  }, [profile.name]);

  return (
    <div className="r-screen">
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
        <div className="r-page r-page-1">
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
              {sanitized.featuredProjects.length > 0 && (
                <section className="r-section">
                  <Heading>Highlighted Projects</Heading>
                  <ol className="r-timeline">
                    {sanitized.featuredProjects.map((project, index) => (
                      <ProjectItem key={index} project={project} showLink />
                    ))}
                  </ol>
                </section>
              )}
              {sanitized.experiences.length > 0 && (
                <section className="r-section">
                  <Heading>Experience</Heading>
                  <ol className="r-timeline">
                    {sanitized.experiences.map((experience, index) => (
                      <ExperienceItem key={index} experience={experience} />
                    ))}
                  </ol>
                </section>
              )}
            </div>
            <div>
              {Object.keys(sanitized.skills).length > 0 && (
                <section className="r-section">
                  <Heading>Professional Skills</Heading>
                  <ul className="r-timeline">
                    {Object.entries(sanitized.skills).map(([group, skills]) => (
                      <li className="r-item" key={group}>
                        <h3 className="r-item-title">{skillHeading(group)}</h3>
                        <ul className="r-skill-grid">
                          {skills.map((skill) => (
                            <li key={skill.title}>{skill.title}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Page 2 ---------- */}
        <div className="r-page r-page-2">
          <div className="r-flow">
            {sanitized.professionalProjects.length > 0 && (
              <section className="r-section">
                <Heading>Professional Projects</Heading>
                <ol className="r-timeline">
                  {sanitized.professionalProjects.map((project, index) => (
                    <ProjectItem key={index} project={project} />
                  ))}
                </ol>
              </section>
            )}
            {sanitized.educations.length > 0 && (
              <section className="r-section">
                <Heading>Education</Heading>
                <ol className="r-timeline">
                  {sanitized.educations.map((item, index) => (
                    <li className="r-item" key={index}>
                      <p className="r-item-sub">
                        From {item.from} to {item.to}
                      </p>
                      <h3 className="r-item-title r-item-title-lg">
                        {item.degree}
                      </h3>
                      <p className="r-text">
                        {item.institution}
                        {item.location && (
                          <>
                            <br />
                            {item.location}
                          </>
                        )}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {sanitized.community.length > 0 && (
              <section className="r-section">
                <Heading>Community</Heading>
                <ol className="r-timeline">
                  {sanitized.community.map((item, index) => (
                    <li className="r-item" key={index}>
                      <h3 className="r-item-title r-item-title-lg">
                        {item.name}
                      </h3>
                      {item.body && <p className="r-item-sub">{item.body}</p>}
                      {item.description && (
                        <p className="r-text">{item.description}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {sanitized.hobbies.length > 0 && (
              <section className="r-section">
                <Heading>Hobbies &amp; Interests</Heading>
                <ul className="r-hobbies">
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
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resume;
