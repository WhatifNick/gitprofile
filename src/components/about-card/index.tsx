import { skeleton } from '../../utils';

/**
 * "About" card. Rendered in two places (left column on mobile, right column on
 * desktop) with only one visible at a time, so `id` keeps headings unique.
 */
const AboutCard = ({
  loading,
  summary,
  id = 'about',
  className = '',
}: {
  loading: boolean;
  summary: string[];
  id?: string;
  className?: string;
}) => (
  <section
    className={`card shadow-lg card-sm bg-base-100 ${className}`}
    aria-labelledby={`${id}-heading`}
  >
    <div className="card-body">
      <div className="mx-3">
        <h2 className="card-title" id={`${id}-heading`}>
          {loading ? (
            skeleton({ widthCls: 'w-24', heightCls: 'h-8' })
          ) : (
            <span className="text-base-content">About</span>
          )}
        </h2>
      </div>
      <div className="mx-3 space-y-3 text-base-content/85 text-sm md:text-base leading-relaxed">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                {skeleton({ widthCls: 'w-full', heightCls: 'h-4' })}
              </div>
            ))
          : summary.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </div>
  </section>
);

export default AboutCard;
