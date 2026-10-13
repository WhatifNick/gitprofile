import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import GitProfile from './components/gitprofile.tsx';

const Resume = lazy(() => import('./components/resume'));
const SkillsPage = lazy(() => import('./components/skills-page'));

const path = window.location.pathname
  .replace(import.meta.env.BASE_URL, '/')
  .replace(/\/+$/, '');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {path === '/resume' ? (
      <Suspense fallback={null}>
        <Resume config={CONFIG} />
      </Suspense>
    ) : path === '/skills' ? (
      <Suspense fallback={null}>
        <SkillsPage config={CONFIG} />
      </Suspense>
    ) : (
      <GitProfile config={CONFIG} />
    )}
  </React.StrictMode>,
);
