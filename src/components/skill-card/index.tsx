import { Skill } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';
import { formatGroupName, SKILLS_PAGE_PATH } from '../../utils/skills';
import SkillChipList from '../skill-chips';
import { useCanHover } from '../../hooks/use-can-hover';

const SkillCard = ({
  loading,
  skills,
}: {
  loading: boolean;
  skills: Record<string, Skill[]>;
}) => {
  const canHover = useCanHover();

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 8; index++) {
      array.push(
        <div className="card shadow-lg compact bg-base-100 w-full" key={index}>
          <div className="flex items-start px-4 py-4 md:px-8 h-full w-full">
            <div className="text-left ">
              <h3 className="font-medium text-base-content text-lg">
                {skeleton({
                  widthCls: 'w-32',
                  heightCls: 'h-6',
                })}
              </h3>
              <div className="mt-2 flex items-center flex-wrap justify-start">
                {Array.from({ length: Math.floor(Math.random() * 10) + 2 }).map(
                  () =>
                    skeleton({
                      widthCls: 'w-16',
                      heightCls: 'h-4',
                      className: 'm-1',
                    }),
                )}
              </div>
            </div>
          </div>
        </div>,
      );
    }

    return array;
  };

  return (
    <div className="col-span-1">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <div className="card shadow-lg compact bg-base-200">
            <div className="card-body">
              <div className="mx-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="card-title">
                  {loading ? (
                    skeleton({ widthCls: 'w-32', heightCls: 'h-8' })
                  ) : (
                    <span className="text-base-content">Skills</span>
                  )}
                </h2>
                {!loading && (
                  <div className="flex items-baseline gap-3 text-sm">
                    <span className="text-base-content/60">
                      {canHover
                        ? 'Hover a skill for details'
                        : 'Tap a skill for details'}
                    </span>
                    <a
                      href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${SKILLS_PAGE_PATH}`}
                      className="link link-primary font-semibold no-underline"
                    >
                      View all →
                    </a>
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  {loading
                    ? renderSkeleton()
                    : Object.keys(skills).map((group) => (
                        <div
                          key={group}
                          className="card shadow-lg compact bg-base-100 w-full"
                        >
                          <div className="flex items-start px-4 py-4 md:px-8 h-full w-full">
                            <div className="text-left w-full">
                              <h3 className="font-medium text-base-content text-lg">
                                {formatGroupName(group)}
                              </h3>
                              <div className="p-3 flow-root">
                                <SkillChipList
                                  variant="rich"
                                  className="-m-1"
                                  items={skills[group].map((skill) => ({
                                    label: skill.title,
                                    skill,
                                  }))}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
