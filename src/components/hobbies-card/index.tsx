import { SanitizedHobby } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';
import { getHobbyIconUrl } from './icons';

const HobbiesCard = ({
  loading,
  hobbies,
}: {
  loading: boolean;
  hobbies: SanitizedHobby[];
}) => (
  <section
    className="card shadow-lg card-sm bg-base-100"
    aria-labelledby="hobbies-heading"
  >
    <div className="card-body">
      <div className="mx-3">
        <h2 className="card-title" id="hobbies-heading">
          {loading ? (
            skeleton({ widthCls: 'w-32', heightCls: 'h-8' })
          ) : (
            <span className="text-base-content">Hobbies &amp; Interests</span>
          )}
        </h2>
      </div>
      <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 mt-2 text-center text-sm text-base-content">
        {hobbies.map((hobby) => {
          const iconUrl = getHobbyIconUrl(hobby.icon);
          return (
            <li key={hobby.title} className="flex flex-col items-center gap-1">
              {loading ? (
                skeleton({ widthCls: 'w-20', heightCls: 'h-20' })
              ) : (
                <>
                  {iconUrl ? (
                    // The SVG is used as a mask so it takes the theme's text
                    // colour and stays visible on dark themes.
                    <span
                      aria-hidden="true"
                      className="hobby-icon w-20 h-20 bg-current text-base-content/85"
                      style={{
                        maskImage: `url("${iconUrl}")`,
                        WebkitMaskImage: `url("${iconUrl}")`,
                      }}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="w-20 h-20 rounded-full border-2 border-base-content/60"
                    />
                  )}
                  {hobby.title}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default HobbiesCard;
