/**
 * The whole-page fade-in (.fade-in) only plays on the first page of a visit.
 * Moving between pages on this site (home <-> /skills) skips it, detected by
 * the previous page being on the same origin.
 */
const cameFromThisSite = (() => {
  try {
    return (
      !!document.referrer &&
      new URL(document.referrer).origin === window.location.origin
    );
  } catch {
    return false;
  }
})();

export const PAGE_FADES_IN = !cameFromThisSite;

/** Class for a page's root element. */
export const pageFadeClass = PAGE_FADES_IN ? 'fade-in' : '';
