/** `hideOnPDF: true` keeps an item on the website but out of the resume PDF. */
export interface PdfVisibility {
  hideOnPDF?: boolean;
}

export interface SanitizedGithub {
  username: string;
}

export interface SanitizedGitHubProjects {
  display: boolean;
  header: string;
  mode: string;
  automatic: {
    sortBy: string;
    limit: number;
    exclude: {
      forks: boolean;
      projects: Array<string>;
    };
  };
  manual: {
    projects: Array<string>;
  };
}

export interface SanitizedExternalProject {
  title: string;
  description?: string;
  imageUrl?: string;
  link: string;
}

export interface SanitizedExternalProjects {
  header: string;
  projects: SanitizedExternalProject[];
}

export interface SanitizedProjects {
  github: SanitizedGitHubProjects;
  external: SanitizedExternalProjects;
}

export interface SanitizedSEO {
  title?: string;
  description?: string;
  imageURL?: string;
}

export interface SanitizedSocial {
  linkedin?: string;
  x?: string;
  mastodon?: string;
  researchGate?: string;
  facebook?: string;
  instagram?: string;
  reddit?: string;
  threads?: string;
  youtube?: string;
  udemy?: string;
  dribbble?: string;
  behance?: string;
  medium?: string;
  dev?: string;
  stackoverflow?: string;
  website?: string;
  telegram?: string;
  phone?: string;
  email?: string;
  discord?: string;
}

export interface SanitizedResume {
  fileUrl?: string;
  fileName?: string;
  location?: string;
  website?: string;
}

export interface SanitizedProfile {
  name: string;
  title: string;
  location: string;
  summary: Array<string>;
}

export interface SanitizedHobby extends PdfVisibility {
  title: string;
  icon?: string;
}

export interface SanitizedExperience extends PdfVisibility {
  company?: string;
  position?: string;
  from: string;
  to: string;
  companyLink?: string;
}

export interface SanitizedCertification extends PdfVisibility {
  body?: string;
  name?: string;
  year?: string;
  link?: string;
}

export interface SanitizedCommunity extends PdfVisibility {
  body?: string;
  name?: string;
  year?: string;
  link?: string;
  description?: string;
}

export interface Project extends PdfVisibility {
  title: string;
  company?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  skills?: Array<string>;
}

export interface Skill extends PdfVisibility {
  title: string;
  iconURL?: string;
  color?: string;
}

export interface SanitizedEducation extends PdfVisibility {
  institution?: string;
  degree?: string;
  from: string;
  to: string;
  link?: string;
  location?: string;
}

export interface SanitizedPublication extends PdfVisibility {
  title: string;
  conferenceName?: string;
  journalName?: string;
  authors?: string;
  link?: string;
  description?: string;
}

export interface SanitizedGoogleAnalytics {
  id?: string;
}

export interface SanitizedHotjar {
  id?: string;
  snippetVersion: number;
}

export interface SanitizedBlog {
  display: boolean;
  source: string;
  username: string;
  limit: number;
}

export interface SanitizedThemeConfig {
  defaultTheme: string;
  disableSwitch: boolean;
  respectPrefersColorScheme: boolean;
  displayAvatarRing: boolean;
  themes: Array<string>;
}

export interface SanitizedConfig {
  github: SanitizedGithub;
  projects: SanitizedProjects;
  featuredProjects: Array<Project>;
  professionalProjects: Array<Project>;
  seo: SanitizedSEO;
  social: SanitizedSocial;
  resume: SanitizedResume;
  profile: SanitizedProfile;
  hobbies: Array<SanitizedHobby>;
  skills: Record<string, Skill[]>;
  experiences: Array<SanitizedExperience>;
  educations: Array<SanitizedEducation>;
  certifications: Array<SanitizedCertification>;
  community: Array<SanitizedCommunity>;
  publications: Array<SanitizedPublication>;
  googleAnalytics: SanitizedGoogleAnalytics;
  hotjar: SanitizedHotjar;
  blog: SanitizedBlog;
  themeConfig: SanitizedThemeConfig;
  footer?: string;
  enablePWA: boolean;
}
