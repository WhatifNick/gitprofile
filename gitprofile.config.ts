// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'whatifnick', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/',
  projects: {
    github: {
      display: false, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: false, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        // projects: ['arifszn/gitprofile', 'arifszn/pandora'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    // external: {
    //   header: 'My Projects',
    //   // To hide the `External Projects` section, keep it empty.
    //   projects: [
    //     {
    //       title: 'Project Name',
    //       description:
    //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut.',
    //       imageUrl:
    //         'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
    //       link: 'https://example.com',
    //     },
    //     {
    //       title: 'Project Name',
    //       description:
    //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut.',
    //       imageUrl:
    //         'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
    //       link: 'https://example.com',
    //     },
    //   ],
    // },
  },
  seo: {
    title: 'Portfolio of Nick Pasquariello',
    description: '',
    imageURL: '',
  },
  social: {
    linkedin: 'npasquariello',
    x: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    discord: '',
    telegram: '',
    website: '',
    phone: '',
    email: 'npasquariello@gmail.com',
  },
  /**
   * Who you are. Used by the site header card, the About section and the
   * generated resume, so edit it here once.
   */
  profile: {
    name: 'Nick Pasquariello',
    title: 'Software Developer',
    location: 'Brisbane, Australia',
    summary: [
      'Hi, my name is Nick. I am a software developer specializing in styling, user experience, and atomic design through components based development. In 2018, I started my journey as a software developer, I have honed my abilities in crafting pixel-perfect, responsive components that prioritize accessibility for all users. My attention to detail and dedication to enhancing user experience have consistently driven my success in this field. I believe that delivering a seamless and user-friendly experience is essential to building trust and confidence with users to increase engagement and satisfaction.',
      'My proficiency in modern frontend technologies allows me to transform design concepts into efficient and visually stunning interfaces, making products not just functional, but aesthetically pleasing as well. What sets me apart is my strong alignment with values such as education, equity, and effective altruism. I find fulfillment in projects that have a positive impact on society, and I am committed to leveraging my technical expertise to contribute to meaningful initiatives.',
    ],
  },
  resume: {
    // `npm run build` renders /resume to dist/resume.pdf, so this always
    // matches the content in this file. Empty fileUrl hides the button.
    fileUrl: '/resume.pdf',
    fileName: 'Nick Pasquariello Resume.pdf',
    // Contact details printed in the resume header (PDF and /resume page only).
    location: 'Brisbane, QLD',
    website: 'nick.cat',
    // Your phone number is NOT stored here: everything in this file ends up
    // in the public website code. Put it in `.env.local` as RESUME_PHONE and
    // the build adds it to a private copy of the PDF only
    // (private/<fileName>), which is never uploaded.
  },
  experiences: [
    {
      company: 'Guzman y Gomez Sunshine Coast',
      position: 'Software Developer Consultant',
      from: 'November 2024',
      to: 'Present',
      companyLink: 'https://reshift.online',
    },
    {
      company: 'Transmax',
      position: 'Software Developer Consultant',
      from: 'October 2025',
      to: 'April 2026',
      companyLink: 'https://www.transmax.com.au/',
    },
    {
      company: 'Mojo Soup',
      position: 'Software Developer',
      from: 'November 2023',
      to: 'November 2024',
      companyLink: 'https://www.mojosoup.com.au/',
    },
    {
      company: 'Studio 71',
      position: 'Front End Software Developer',
      from: 'February 2022',
      to: 'July 2023',
      companyLink: 'https://www.studio71.com/',
    },
    {
      company: 'Degreed',
      position: 'Front End Software Developer',
      from: 'March 2020',
      to: 'February 2022',
      companyLink: 'https://degreed.com/',
    },
    {
      company: 'Adepto',
      position: 'Front End Software Engineer',
      from: 'October 2018',
      to: 'March 2020',
    },
  ],
  educations: [
    {
      institution: 'Coder Academy',
      degree: 'Higher Education Diploma of Information Technologies',
      from: 'February 2018',
      to: 'August 2018',
      link: 'https://coderacademy.edu.au/',
      location: 'Brisbane, Australia',
    },
    {
      institution: 'Georgia Institute of Technology',
      degree: 'B.S. in Mechanical Engineering',
      from: 'August 2011',
      to: 'May 2015',
      link: 'https://www.gatech.edu/',
      location: 'Atlanta, Georgia',
    },
  ],
  // `icon` is a file name (without .svg) from src/assets/interest-icons.
  // Tip: add `hideOnPDF: true` to any item in this file (a project, job,
  // skill, hobby...) to keep it on the website but drop it from the PDF.
  hobbies: [
    { title: 'Drag Race', icon: 'drag-race' },
    { title: 'Podcasts', icon: 'podcasts' },
    { title: 'D&D / Board Games', icon: 'board-games' },
    { title: 'Accessibility', icon: 'accessibility' },
    { title: 'Sustainability & Environment', icon: 'sustainability' },
    { title: 'Travel', icon: 'travel' },
    { title: 'Cats', icon: 'cats' },
    { title: 'Equality & Equity', icon: 'equality' },
  ],
  certifications: [],
  community: [
    {
      // year: 'March 2022',
      name: 'Out at Degreed Events Coordinator',
      body: 'LGBTQ+ Employee BRG',
      description:
        'Working with like minded individuals to create a safe and inclusive environment to work in. Create events to educate, celebrate, and create understanding around LGBT+ community. Nominated for a Diversity, Inclusion, & Belonging Award',
    },
  ],
  publications: [
    // {
    //   title: 'Reshift',
    //   conferenceName: '',
    //   journalName: 'Shift Manager Progress App',
    //   authors: 'John Doe, Jane Smith',
    //   link: 'https://reshift.online',
    //   description:
    //     'Web app to score & track shift managers performance, gamifying the experience and significantly improving performance on every metric, while increasing reporting speed and consistency for restaurant managers.',
    // },
  ],
  featuredProjects: [
    {
      title: 'NYSD - website redesign',
      company: 'New York School of Design',
      description:
        "Complete overhaul of the NYSD's existing WordPress setup, migrating it to a modern, mobile-first, tech stack, improving user experience, modernizing the visual design, and optimizing for mobile performance and accessibility, while ensuring seamless content management and scalability.",
      skills: [
        'Typescript',
        'Next.js',
        'HubSpot',
        'Vercel',
        'Sanity',
        'Tailwind CSS',
        'Google Analytics',
      ],
      imageUrl: 'nysdIcon',
      link: 'https://nysd-website-nine.vercel.app',
    },
    {
      title: 'CyberiskIQ - website redesign',
      company: 'CyberiskIQ',
      description:
        'Redesigned outdated WordPress website for CyberiskIQ, improving user experience and modernizing the visual design. Optimized for mobile performance and accessibility, the website was enhanced with fully customizable blog and quiz components.',
      skills: [
        'Javascript',
        'React',
        'Vercel',
        'Decap CMS',
        'Resend',
        'Tailwind CSS',
      ],
      imageUrl: 'cyberiskIQIcon',
      link: 'https://cyberiskiq.com',
    },
    {
      title: 'Reshift - Shift Manager Progress App',
      company: 'Guzman y Gomez Sunshine Coast',
      description:
        'Web app to score & track shift managers performance, gamifying the experience and significantly improving performance on every metric, while increasing reporting speed and consistency for restaurant managers.',
      skills: [
        'Typescript',
        'React',
        'Supabase',
        // 'react-router-dom',
        'Material UI',
        'MUI X',
      ],
      imageUrl: 'reshiftIcon',
      link: 'https://reshift.online',
    },
    {
      title: 'Green & Me',
      company: 'Personal Project',
      description:
        "Web app to score and track one's impact funding fossil fuels based on where their money is kept. This combines my love for activism and the environment. Designed for mobile first.",
      skills: [
        'Javascript',
        'React',
        'Firebase',
        // 'react-router-dom',
        'Redux',
        'Material UI',
      ],
      imageUrl: 'greenAndMeIcon',
      link: 'https://greenand.me/',
    },
  ],
  /**
   * Skills, grouped by heading. Each skill can have:
   *  - level: 'expert' | 'proficient' | 'working' | 'familiar'
   *  - description: a sentence or two on how you've used it
   *  - aliases: other names your projects use for it (for chip links)
   * Levels and descriptions show in the skill popover and on /skills, never
   * on the resume PDF.
   *
   * TODO(Nick): levels and descriptions below are first drafts written from
   * your projects and job history. Review and adjust before merging.
   */
  skills: {
    languages: [
      {
        title: 'JavaScript',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        level: 'expert',
        description:
          'My daily language since 2018, from AngularJS apps through to modern React codebases.',
      },
      {
        title: 'TypeScript',
        url: 'https://www.typescriptlang.org/',
        level: 'expert',
        description:
          'JavaScript, with more type safety. Default for every project since 2021. I lean on strong types to make component APIs self-documenting and refactors safe.',
      },
      {
        title: 'HTML',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        level: 'expert',
        description:
          'Semantic, accessible markup is where every component I build starts. Less is more when it comes to HTML structure.',
      },
      {
        title: 'CSS/SCSS/SASS',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
        level: 'expert',
        description:
          "CSS, SCSS, SASS: it's all the same in different packages. Don't get me started. I love styling and will spend all day on it if I could.",
      },
      {
        title: 'Liquid',
        url: 'https://shopify.github.io/liquid/',
        level: 'working',
        description:
          'Built and customized storefront templates with Shopify-style Liquid.',
      },
      {
        title: 'Ruby',
        url: 'https://www.ruby-lang.org/',
        level: 'familiar',
        description:
          "This was my first ever programming language! Haven't used it much since, but it always has a special place in my heart.",
      },
    ],
    frameworks: [
      {
        title: 'React/React Native',
        url: 'https://react.dev/',
        level: 'expert',
        description:
          'My main framework across six roles: greenfield apps, large rewrites, component libraries and performance work.',
      },
      {
        title: 'Angular/AngularJS',
        url: 'https://angular.dev/',
        level: 'proficient',
        description:
          'Built features in Angular at Degreed and led an AngularJS-to-React migration at Mojo Soup.',
      },
      {
        title: 'Next.js',
        url: 'https://nextjs.org/',
        level: 'proficient',
        description:
          'Fast becoming one of my favorite frameworks. Built the NYSD marketing site on Next.js with a headless CMS and Vercel deploys.',
      },
      {
        title: 'Vue',
        url: 'https://vuejs.org/',
        level: 'working',
        description:
          "Another JS framework. They're all the same when you get down to it, but Vue makes it fun.",
      },
      {
        title: 'Ruby on Rails',
        url: 'https://rubyonrails.org/',
        level: 'familiar',
        description:
          'Built full-stack Rails apps while studying at Coder Academy.',
      },
    ],
    design: [
      {
        title: 'Sketch',
        url: 'https://www.sketch.com/',
        level: 'proficient',
        description:
          'Self taught through some Udemy and YouTube courses, I often use sketch to mock up my websites before development.',
      },
      {
        title: 'Figma',
        url: 'https://www.figma.com/',
        level: 'proficient',
        description:
          "It's Sketch, on the web! Love a good FigJam. I've turned many Figma designs into working components and pages.",
      },
    ],
    styling: [
      {
        title: 'Material UI',
        url: 'https://mui.com/material-ui/',
        aliases: ['Material UI (MUI X + Core)'],
        level: 'expert',
        description:
          'Used on almost every app I have built since 2019, including theming, custom components and contributing to a company Storybook library.',
      },
      {
        title: 'Semantic UI',
        url: 'https://semantic-ui.com/',
        level: 'proficient',
        description:
          'Very similar to Material UI or other component libraries.',
      },
      {
        title: 'Fluent UI',
        url: 'https://developer.microsoft.com/en-us/fluentui',
        level: 'working',
        description:
          'Used for Microsoft-ecosystem apps alongside SharePoint and Power Apps.',
      },
      {
        title: 'Tailwind CSS',
        url: 'https://tailwindcss.com/',
        level: 'proficient',
        description:
          'My go-to for personal and client sites, including this one.',
      },
      {
        title: 'CSS Modules',
        url: 'https://github.com/css-modules/css-modules',
        level: 'proficient',
        description:
          'Locally scoped component styles, used heavily in the Studio 71 search filters overhaul.',
      },
      {
        title: 'BEM Methodology',
        url: 'https://getbem.com/',
        level: 'proficient',
        description:
          'Naming convention I use to keep plain CSS predictable at scale.',
      },
      {
        title: 'Bootstrap',
        url: 'https://getbootstrap.com/',
        level: 'proficient',
        description: 'Used in earlier projects for fast, responsive layouts.',
      },
      {
        title: 'Styled Components',
        url: 'https://styled-components.com/',
        level: 'proficient',
        description:
          'CSS-in-JS for themeable React component libraries. Fun to use, but seems less useful with enhancements to modern frameworks.',
      },
    ],
    'Charts & Graphics': [
      {
        title: 'MUI X',
        url: 'https://mui.com/x/',
        level: 'proficient',
        description:
          "Date pickers, data grids and charts. I'm very familiar with these components; strengths and limitations.",
      },
      {
        title: 'Highcharts',
        url: 'https://www.highcharts.com/',
        level: 'proficient',
        description:
          'Used to visualized learner skill progress on the Degreed profile overview page.',
      },
      {
        title: 'D3.js',
        url: 'https://d3js.org/',
        level: 'working',
        description: 'Custom, bespoke data visualizations.',
      },

      {
        title: 'ApexCharts',
        url: 'https://apexcharts.com/',
        level: 'working',
        description: 'Dashboard charts for reporting tools.',
      },
      {
        title: 'AG Charts',
        url: 'https://www.ag-grid.com/charts/',
        level: 'proficient',
        description: 'Charts paired with AG Grid data in reporting apps.',
      },
      {
        title: 'Recharts',
        url: 'https://recharts.org/',
        level: 'working',
        description: 'Lightweight React charts for dashboards.',
      },
    ],
    databases: [
      {
        title: 'Azure',
        url: 'https://azure.microsoft.com/',
        level: 'proficient',
        description:
          'Backend and hosting for the Mojo Soup medical timesheet app.',
      },
      {
        title: 'Supabase',
        url: 'https://supabase.com/',
        level: 'proficient',
        description:
          'Auth, Postgres and row-level security behind Reshift, my shift manager app.',
      },
      {
        title: 'Firebase',
        url: 'https://firebase.google.com/',
        level: 'working',
        description:
          'Auth, Firestore and hosting; Green & Me and this site run on it.',
      },
      {
        title: 'PostgreSQL',
        url: 'https://www.postgresql.org/',
        level: 'working',
        description: 'Schema design and queries, mostly through Supabase.',
      },
      {
        title: 'MongoDB',
        url: 'https://www.mongodb.com/',
        level: 'familiar',
        description: 'Document storage in study and side projects.',
      },
      {
        title: 'SQLite',
        url: 'https://www.sqlite.org/',
        level: 'familiar',
        description: 'Local storage for small apps and prototypes.',
      },
    ],
    platforms: [
      {
        title: 'Atlassian/Jira',
        url: 'https://www.atlassian.com/software/jira',
        level: 'proficient',
        description:
          'Agile boards, sprints and docs in every team I have joined.',
      },
      {
        title: 'Vercel',
        url: 'https://vercel.com/',
        level: 'proficient',
        description: 'Deploys and preview environments for client sites.',
      },
      {
        title: 'Sanity',
        url: 'https://www.sanity.io/',
        level: 'working',
        description: 'Headless CMS schemas and content modelling for NYSD.',
      },
      {
        title: 'GitHub',
        url: 'https://github.com/',
        level: 'proficient',
        description: "It's my bread and butter.",
      },
      {
        title: 'GitLab',
        url: 'https://about.gitlab.com/',
        level: 'proficient',
        description: 'You push, you pull. Same as github.',
      },
      {
        title: 'Bitbucket',
        url: 'https://bitbucket.org/',
        level: 'proficient',
        description: 'You push, you pull. Same as github.',
      },
      {
        title: 'Power BI/Sharepoint',
        url: 'https://www.microsoft.com/en-us/microsoft-365/sharepoint',
        level: 'working',
        description:
          'Built SharePoint-backed React apps for Queensland government clients.',
      },
      {
        title: 'Hubspot',
        url: 'https://www.hubspot.com/',
        level: 'working',
        description: 'Forms and CRM integrations on marketing sites.',
      },
      {
        title: 'Squarespace',
        url: 'https://www.squarespace.com/',
        level: 'working',
        description: 'Small-business sites and custom code injection.',
      },
      {
        title: 'Decap CMS',
        url: 'https://decapcms.org/',
        level: 'working',
        description:
          'Git-based CMS powering the editable blog and quiz on CyberiskIQ.',
      },
      {
        title: 'Resend',
        url: 'https://resend.com/',
        level: 'working',
        hideOnPDF: true,
        description: 'Transactional email from contact forms.',
      },
      {
        title: 'WordPress',
        url: 'https://wordpress.org/',
        level: 'familiar',
        hideOnPDF: true,
        description:
          'Content management and blogging platform. Hate to use it, love to see it replaced by better solutions when possible. Contact me for help.',
      },
    ],
    // Packages show on the website only (hideOnPDF on every item hides the
    // whole group from the resume PDF).
    packages: [
      {
        title: 'tanstack/react-query',
        url: 'https://tanstack.com/query',
        aliases: ['TanStack Query'],
        level: 'proficient',
        description:
          'Server-state caching that let me remove thousands of lines of hand-rolled fetching code at Transmax.',
      },
      {
        title: 'react-router-dom',
        url: 'https://reactrouter.com/',
        level: 'proficient',
        description: 'Routing for single-page React apps.',
      },
      {
        title: 'redux',
        url: 'https://redux.js.org/',
        level: 'proficient',
        description: 'Global state for larger React apps.',
      },
      {
        title: 'ag-grid',
        url: 'https://www.ag-grid.com/',
        level: 'proficient',
        description:
          'Large, editable data grids with custom cell renderers across several Mojo Soup apps.',
      },
      {
        title: 'react-hook-form',
        url: 'https://react-hook-form.com/',
        level: 'proficient',
        hideOnPDF: true,
        description: 'Performant forms, including a reusable form builder.',
      },
      {
        title: 'yup',
        url: 'https://www.npmjs.com/package/yup',
        level: 'working',
        hideOnPDF: true,
        description: 'Schema validation paired with react-hook-form.',
      },
      {
        title: 'react-big-calendar',
        url: 'https://github.com/jquense/react-big-calendar',
        level: 'working',
        hideOnPDF: true,
        description:
          'Used to create shift and timesheet calendar application at Mojo Soup.',
      },
      {
        title: 'lodash',
        url: 'https://lodash.com/',
        level: 'proficient',
        hideOnPDF: true,
        description:
          "Everyday data utilities. We don't need to reinvent the wheel.",
      },
    ],
    agents: [
      {
        title: 'Claude',
        url: 'https://anthropic.com/claude',
        level: 'proficient',
        description:
          'Pair-programming, refactors and code review in my daily workflow.',
      },
      {
        title: 'Copilot',
        url: 'https://github.com/features/copilot',
        level: 'proficient',
        description: 'Inline completions in the editor.',
      },
      {
        title: 'ChatGPT',
        url: 'https://chatgpt.com/',
        level: 'working',
        description:
          'Built a ChatGPT-powered messaging interface at Studio 71.',
      },
    ],
  },
  professionalProjects: [
    {
      title: 'Disruptions Tab Rework',
      company: 'Transmax',
      description:
        'Starting with an atomic design approach, I lead the team in reworking the disruptions tab for better user experience and code maintainability. This involved breaking down the UI into reusable components and ensuring consistent styling across the application, resulting in tens of thousands of lines of code to be removed from the codebase, which significantly improved build and initial page load time, while removing multiple redundancies and sources of truth, removing current and potential future bugs.',
      skills: ['Typescript', 'React', 'tanstack/react-query', 'Material UI'],
    },
    {
      title: 'Component Library - Date Range Picker',
      company: 'Transmax',
      description:
        'Contributed new date range picker to Storybook component library and integrated it into existing filter toolbar and data grid. Created upgrade guide for company wide usage.',
      skills: [
        'Typescript',
        'Storybook',
        'React',
        'Material UI (MUI X + Core)',
      ],
    },
    {
      title: 'Medical Timesheet App',
      company: 'Mojo Soup',
      description:
        'Green field time sheeting solution to replace manual timesheet management. This app was built for internal and contract medical shift workers to report work hours to manager, giving them the ability to reject or approve and track billable hours across multiple projects.',
      skills: [
        'Typescript',
        'React',
        'react-big-calendar',
        'ag-grid',
        'Azure',
        'Material UI',
      ],
    },
    {
      title: 'Disaster Reporting Portal',
      company: 'Mojo Soup',
      description:
        "Custom Google Maps component that uses the metadata from user's uploaded photos to position them on the map. The component can upload hundreds of photos at once with drag and drop functionality. Users can view photos side by side in draggable modals to compare pre and post road repairs, measure distances between locations, and even display them in street view.",
      skills: [
        'Typescript',
        'React',
        'Google Maps Api',
        'Material UI',
        'AG Grid',
        'PCF (Power Apps Component Framework)',
      ],
    },
    {
      title: 'Digital Delivery Portal',
      company: 'Mojo Soup',
      description:
        'Led the rebuild of an older AngularJS app into React version 18, creating custom reusable components, such as a form builder, to speed of development time. Implemented colocation file structure and atomic design to increase scalability for when the rest of the application is ready for migration.',
      skills: [
        'Typescript',
        'React',
        'AngularJS',
        'Material UI',
        'AG Grid',
        'TanStack Query',
        'Tailwind CSS',
        'SharePoint',
      ],
    },
    {
      title: 'Report Once Solution',
      company: 'Mojo Soup',
      description:
        'Custom react app to track and report strategic initiatives for Queensland Health. Led rewrite of application to make it responsive for all screen sizes, while improving reporting capabilities.',
      skills: [
        'Typescript',
        'React',
        'Material UI',
        'AG Grid',
        'TanStack Query',
        'SharePoint',
      ],
      hideOnPDF: true,
    },
    {
      title: 'ChatGPT Messaging Interface',
      company: 'Studio 71',
      description:
        'Built messaging interface for users to be able to ask metrics questions to retrofitted ChatGPT and receive back search prompts and links.',
      skills: ['Javascript', 'React', 'ChatGPT', 'SemanticUI'],
    },
    {
      title: 'Search Filters Overhaul',
      company: 'Studio 71',
      description:
        'Built reusable filter component to bring uniformity to styles and functionality, deleting over 30 redundant style sheets and implementing new pinning feature to set favorites in local storage to reduce workload of backend team.',
      skills: ['Javascript', 'React', 'CSS Modules'],
    },
    {
      title: 'Profile Overview Page',
      company: 'Degreed',
      description:
        'Summarizing user’s skills, experiences, achievements, and learnings into one central page. Data visualization of skills progress using Highcharts.',
      skills: ['Angular', 'Typescript', 'Highcharts'],
    },
    {
      title: 'Rebuilt profile, settings, & sign up wizard',
      company: 'Adepto',
      description:
        "Migrating from Angular, my team rebuilt and redesigned the user's profile, settings page, and sign up wizard. Implemented 2 factor authentication in settings. Implemented CV parsing in sign up wizard.",
      skills: ['Javascript', 'React', 'Material UI'],
      hideOnPDF: true,
    },
    {
      title: 'Component Library',
      company: 'Adepto',
      description:
        "Individually created central place for developers to view component's source code and properties to learn how to implement new or existing components into the app. This significantly sped up front end development time especially for new hires.",
      skills: ['Storybook', 'React', 'Material UI'],
      hideOnPDF: true,
    },
    {
      title: 'In App Messaging using Twilio',
      company: 'Adepto',
      description:
        'Created new section in app for instant messaging between users. This greatly increased user’s time in app. This was built using the Twilio API',
      skills: ['Javascript', 'React', 'Twilio'],
      hideOnPDF: true,
    },
  ],
  // Display articles from your medium or dev account. (Optional)
  // blog: {
  //   source: 'dev', // medium | dev
  //   username: 'arifszn', // to hide blog section, keep it empty
  //   limit: 2, // How many articles to display. Max is 10.
  // },
  googleAnalytics: {
    id: 'G-HKNL6N8WNL', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'emerald',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'caramellatte',
      'abyss',
      'silk',
      'procyon',
    ],
  },

  enablePWA: true,
};

export default CONFIG;
