import { useEffect, useState, useRef } from 'react';
import styles from './Footer.module.css';
import catPaw from '../../assets/cat-paw.svg'; // Adjust the path as necessary

// iOS Safari draws page content behind its floating bottom toolbar, so the
// visible area is taller than window.innerHeight. Without this extra distance
// the cat's ears stay visible under the toolbar after the scroll-back.
const IOS_TOOLBAR_FALLBACK = 80;

// Only Safari on iOS draws content behind its toolbar. Chrome, Brave, Firefox
// etc. on iOS also pass the -webkit-touch-callout check (they all use WebKit),
// so exclude them: most add a token to the user agent, and Brave (which copies
// Safari's user agent) exposes navigator.brave instead.
const isIosSafari = () => {
  if (
    typeof CSS === 'undefined' ||
    !CSS.supports('-webkit-touch-callout', 'none')
  )
    return false;
  if ('brave' in navigator) return false;
  return !/CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|DuckDuckGo|YaBrowser|GSA\//.test(
    navigator.userAgent,
  );
};

const getIosToolbarOverlap = () => {
  if (!isIosSafari()) return 0;

  // 100lvh is the viewport height with the toolbars fully retracted, i.e. the
  // whole area the page can be drawn into.
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none;';
  document.body.appendChild(probe);
  const largeViewport = probe.getBoundingClientRect().height;
  probe.remove();

  return Math.max(largeViewport - window.innerHeight, IOS_TOOLBAR_FALLBACK);
};

const Footer = () => {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [animate, setAnimate] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Skip the playful scroll-back for people who prefer reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.addEventListener('scroll', trackScrolling);

    return () => {
      document.removeEventListener('scroll', trackScrolling);
    };
    // Registered once on mount; trackScrolling manages its own re-adding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackScrolling = () => {
    if (!footerRef.current) return;

    const bottom =
      document.body.scrollHeight - window.innerHeight - 40 < window.scrollY;

    if (bottom) {
      document.removeEventListener('scroll', trackScrolling);

      setTimeout(() => {
        if (footerRef.current) {
          const scrollDistance =
            footerRef.current.scrollHeight -
            (document.body.scrollHeight - window.innerHeight - window.scrollY) +
            getIosToolbarOverlap();

          if (scrollDistance > 0) {
            setCounter((prev) => {
              if (prev === 2) return 0; // Reset counter after 2 increments
              return prev + 1;
            });
            setAnimate(true);
            setTimeout(() => {
              window.scrollTo({
                top: window.scrollY - scrollDistance,
                behavior: 'smooth',
              });
            }, 200);
            setTimeout(() => {
              setAnimate(false);
            }, 1000);
          }
          document.addEventListener('scroll', trackScrolling);
        }
      }, 2000);
    }
  };

  return (
    <div className={styles.footer} ref={footerRef} aria-hidden="true">
      <div className={styles.wrapper}>
        <img
          src={catPaw}
          alt=""
          className={`${styles.cat_paw} ${animate && [0, 1].includes(counter) ? styles.animate : ''}`}
        />
        <div className={styles.cat}>
          <div className={`${styles.ear} ${styles.ear_left}`}></div>
          <div className={`${styles.ear} ${styles.ear_right}`}></div>
          <div className={styles.face}>
            <div className={`${styles.eye} ${styles.eye_left}`}>
              <div className={styles.eye_pupil} />
            </div>
            <div className={`${styles.eye} ${styles.eye_right}`}>
              <div className={styles.eye_pupil} />
            </div>
            <div className={styles.muzzle}></div>
          </div>
        </div>
        <img
          src={catPaw}
          alt=""
          className={`${styles.cat_paw} ${animate && [0, 2].includes(counter) ? styles.animate : ''}`}
        />
      </div>
    </div>
  );
};

export default Footer;
